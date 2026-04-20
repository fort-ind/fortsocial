-- ============ PROFILE ADDITIONS ============
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS is_private boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS personal_message text,
  ADD COLUMN IF NOT EXISTS mood text,
  ADD COLUMN IF NOT EXISTS now_playing text;

-- ============ ENUMS ============
DO $$ BEGIN
  CREATE TYPE public.follow_status AS ENUM ('pending', 'accepted');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.group_visibility AS ENUM ('public', 'private', 'invite_only');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.group_role AS ENUM ('owner', 'admin', 'member');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ============ FOLLOWS ============
CREATE TABLE IF NOT EXISTS public.follows (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id uuid NOT NULL,
  following_id uuid NOT NULL,
  status public.follow_status NOT NULL DEFAULT 'accepted',
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (follower_id, following_id),
  CHECK (follower_id <> following_id)
);
ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Accepted follows are public"
  ON public.follows FOR SELECT
  USING (status = 'accepted');

CREATE POLICY "Users see their own follow rows"
  ON public.follows FOR SELECT
  USING (auth.uid() = follower_id OR auth.uid() = following_id);

CREATE POLICY "Users can create their own follows"
  ON public.follows FOR INSERT
  WITH CHECK (auth.uid() = follower_id);

CREATE POLICY "Target can accept incoming follow"
  ON public.follows FOR UPDATE
  USING (auth.uid() = following_id)
  WITH CHECK (auth.uid() = following_id);

CREATE POLICY "Either side can remove the follow"
  ON public.follows FOR DELETE
  USING (auth.uid() = follower_id OR auth.uid() = following_id);

CREATE INDEX IF NOT EXISTS idx_follows_follower ON public.follows(follower_id);
CREATE INDEX IF NOT EXISTS idx_follows_following ON public.follows(following_id);

-- ============ GROUPS ============
CREATE TABLE IF NOT EXISTS public.groups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL,
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  visibility public.group_visibility NOT NULL DEFAULT 'public',
  avatar_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.group_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id uuid NOT NULL REFERENCES public.groups(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  role public.group_role NOT NULL DEFAULT 'member',
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (group_id, user_id)
);
ALTER TABLE public.group_members ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.group_invites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id uuid NOT NULL REFERENCES public.groups(id) ON DELETE CASCADE,
  invitee_id uuid NOT NULL,
  inviter_id uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (group_id, invitee_id)
);
ALTER TABLE public.group_invites ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.group_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id uuid NOT NULL REFERENCES public.groups(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  content text NOT NULL,
  image_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.group_posts ENABLE ROW LEVEL SECURITY;

-- ============ SECURITY DEFINER HELPERS (avoid RLS recursion) ============
CREATE OR REPLACE FUNCTION public.is_group_member(_group_id uuid, _user_id uuid)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.group_members
    WHERE group_id = _group_id AND user_id = _user_id
  );
$$;

CREATE OR REPLACE FUNCTION public.is_group_admin(_group_id uuid, _user_id uuid)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.group_members
    WHERE group_id = _group_id AND user_id = _user_id AND role IN ('owner','admin')
  );
$$;

CREATE OR REPLACE FUNCTION public.group_visibility_of(_group_id uuid)
RETURNS public.group_visibility
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT visibility FROM public.groups WHERE id = _group_id;
$$;

CREATE OR REPLACE FUNCTION public.has_group_invite(_group_id uuid, _user_id uuid)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.group_invites
    WHERE group_id = _group_id AND invitee_id = _user_id
  );
$$;

-- ============ GROUPS POLICIES ============
CREATE POLICY "Public groups visible to all, private to members"
  ON public.groups FOR SELECT
  USING (
    visibility = 'public'
    OR public.is_group_member(id, auth.uid())
    OR (visibility = 'invite_only' AND public.has_group_invite(id, auth.uid()))
  );

CREATE POLICY "Authenticated users can create groups"
  ON public.groups FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Owner can update group"
  ON public.groups FOR UPDATE
  USING (auth.uid() = owner_id);

CREATE POLICY "Owner can delete group"
  ON public.groups FOR DELETE
  USING (auth.uid() = owner_id);

-- ============ GROUP_MEMBERS POLICIES ============
CREATE POLICY "Members can see members of visible groups"
  ON public.group_members FOR SELECT
  USING (
    public.group_visibility_of(group_id) = 'public'
    OR public.is_group_member(group_id, auth.uid())
    OR auth.uid() = user_id
  );

CREATE POLICY "Join public group or accept invite"
  ON public.group_members FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    AND (
      public.group_visibility_of(group_id) = 'public'
      OR public.has_group_invite(group_id, auth.uid())
    )
  );

CREATE POLICY "Admins can add members"
  ON public.group_members FOR INSERT
  WITH CHECK (public.is_group_admin(group_id, auth.uid()));

CREATE POLICY "Leave group or admin removes"
  ON public.group_members FOR DELETE
  USING (auth.uid() = user_id OR public.is_group_admin(group_id, auth.uid()));

CREATE POLICY "Admins update roles"
  ON public.group_members FOR UPDATE
  USING (public.is_group_admin(group_id, auth.uid()));

-- ============ GROUP_INVITES POLICIES ============
CREATE POLICY "Invitee or admin can view invites"
  ON public.group_invites FOR SELECT
  USING (auth.uid() = invitee_id OR public.is_group_admin(group_id, auth.uid()));

CREATE POLICY "Admins create invites"
  ON public.group_invites FOR INSERT
  WITH CHECK (auth.uid() = inviter_id AND public.is_group_admin(group_id, auth.uid()));

CREATE POLICY "Invitee or admin delete invites"
  ON public.group_invites FOR DELETE
  USING (auth.uid() = invitee_id OR public.is_group_admin(group_id, auth.uid()));

-- ============ GROUP_POSTS POLICIES ============
CREATE POLICY "Members or public can view group posts"
  ON public.group_posts FOR SELECT
  USING (
    public.group_visibility_of(group_id) = 'public'
    OR public.is_group_member(group_id, auth.uid())
  );

CREATE POLICY "Members can post"
  ON public.group_posts FOR INSERT
  WITH CHECK (auth.uid() = user_id AND public.is_group_member(group_id, auth.uid()));

CREATE POLICY "Author or admin deletes group post"
  ON public.group_posts FOR DELETE
  USING (auth.uid() = user_id OR public.is_group_admin(group_id, auth.uid()));

CREATE POLICY "Author updates own group post"
  ON public.group_posts FOR UPDATE
  USING (auth.uid() = user_id);

-- ============ AUTO-OWNERSHIP TRIGGER ============
CREATE OR REPLACE FUNCTION public.add_group_owner_as_member()
RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.group_members (group_id, user_id, role)
  VALUES (NEW.id, NEW.owner_id, 'owner')
  ON CONFLICT DO NOTHING;
  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS trg_add_group_owner ON public.groups;
CREATE TRIGGER trg_add_group_owner
  AFTER INSERT ON public.groups
  FOR EACH ROW EXECUTE FUNCTION public.add_group_owner_as_member();

-- ============ INDEXES ============
CREATE INDEX IF NOT EXISTS idx_group_members_user ON public.group_members(user_id);
CREATE INDEX IF NOT EXISTS idx_group_members_group ON public.group_members(group_id);
CREATE INDEX IF NOT EXISTS idx_group_posts_group ON public.group_posts(group_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_group_invites_invitee ON public.group_invites(invitee_id);