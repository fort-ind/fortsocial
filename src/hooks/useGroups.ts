import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export type GroupVisibility = 'public' | 'private' | 'invite_only';
export type GroupRole = 'owner' | 'admin' | 'member';

export interface Group {
  id: string;
  owner_id: string;
  name: string;
  slug: string;
  description: string | null;
  visibility: GroupVisibility;
  avatar_url: string | null;
  created_at: string;
}

const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40) || 'group';

export const useGroups = () => {
  const { user } = useAuth();
  const qc = useQueryClient();

  const allGroupsQuery = useQuery({
    queryKey: ['groups', 'all'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('groups')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as Group[];
    },
  });

  const myGroupsQuery = useQuery({
    queryKey: ['groups', 'mine', user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('group_members')
        .select('group_id, role, groups(*)')
        .eq('user_id', user!.id);
      if (error) throw error;
      return (data ?? []).map((r: any) => ({ ...(r.groups as Group), role: r.role as GroupRole }));
    },
  });

  const myInvitesQuery = useQuery({
    queryKey: ['group-invites', user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('group_invites')
        .select('*, groups(*)')
        .eq('invitee_id', user!.id);
      if (error) return [];
      return data as any[];
    },
  });

  const createGroup = useMutation({
    mutationFn: async (input: { name: string; description?: string; visibility: GroupVisibility }) => {
      const slug = `${slugify(input.name)}-${crypto.randomUUID().slice(0, 6)}`;
      const { data, error } = await supabase
        .from('groups')
        .insert({
          owner_id: user!.id,
          name: input.name,
          description: input.description ?? null,
          visibility: input.visibility,
          slug,
        })
        .select()
        .single();
      if (error) throw error;
      return data as Group;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['groups'] });
      toast.success('Group created');
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const joinGroup = useMutation({
    mutationFn: async (groupId: string) => {
      const { error } = await supabase
        .from('group_members')
        .insert({ group_id: groupId, user_id: user!.id, role: 'member' });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['groups'] });
      toast.success('Joined group');
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const leaveGroup = useMutation({
    mutationFn: async (groupId: string) => {
      const { error } = await supabase
        .from('group_members')
        .delete()
        .eq('group_id', groupId)
        .eq('user_id', user!.id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['groups'] });
      toast.success('Left group');
    },
  });

  const acceptInvite = useMutation({
    mutationFn: async ({ groupId, inviteId }: { groupId: string; inviteId: string }) => {
      const { error: insertErr } = await supabase
        .from('group_members')
        .insert({ group_id: groupId, user_id: user!.id, role: 'member' });
      if (insertErr) throw insertErr;
      await supabase.from('group_invites').delete().eq('id', inviteId);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['groups'] });
      qc.invalidateQueries({ queryKey: ['group-invites'] });
      toast.success('Invite accepted');
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const declineInvite = useMutation({
    mutationFn: async (inviteId: string) => {
      const { error } = await supabase.from('group_invites').delete().eq('id', inviteId);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['group-invites'] }),
  });

  return {
    allGroupsQuery,
    myGroupsQuery,
    myInvitesQuery,
    createGroup,
    joinGroup,
    leaveGroup,
    acceptInvite,
    declineInvite,
  };
};

export const useGroup = (groupId?: string) => {
  const { user } = useAuth();
  const qc = useQueryClient();

  const groupQuery = useQuery({
    queryKey: ['group', groupId],
    enabled: !!groupId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('groups')
        .select('*')
        .eq('id', groupId!)
        .maybeSingle();
      if (error) throw error;
      return data as Group | null;
    },
  });

  const membersQuery = useQuery({
    queryKey: ['group-members', groupId],
    enabled: !!groupId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('group_members')
        .select('*, profiles(display_name, avatar_url, handle)')
        .eq('group_id', groupId!);
      if (error) return [];
      return data as any[];
    },
  });

  const myMembershipQuery = useQuery({
    queryKey: ['group-membership', groupId, user?.id],
    enabled: !!groupId && !!user,
    queryFn: async () => {
      const { data } = await supabase
        .from('group_members')
        .select('*')
        .eq('group_id', groupId!)
        .eq('user_id', user!.id)
        .maybeSingle();
      return data as any;
    },
  });

  const postsQuery = useQuery({
    queryKey: ['group-posts', groupId],
    enabled: !!groupId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('group_posts')
        .select('*, profiles(display_name, avatar_url, handle)')
        .eq('group_id', groupId!)
        .order('created_at', { ascending: false });
      if (error) return [];
      return data as any[];
    },
  });

  const createGroupPost = useMutation({
    mutationFn: async (content: string) => {
      const { error } = await supabase
        .from('group_posts')
        .insert({ group_id: groupId!, user_id: user!.id, content });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['group-posts', groupId] });
      toast.success('Posted');
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const inviteUser = useMutation({
    mutationFn: async (handle: string) => {
      const { data: prof, error: profErr } = await supabase
        .from('profiles')
        .select('id')
        .eq('handle', handle.replace(/^@/, ''))
        .maybeSingle();
      if (profErr) throw profErr;
      if (!prof) throw new Error('User not found');
      const { error } = await supabase.from('group_invites').insert({
        group_id: groupId!,
        invitee_id: prof.id,
        inviter_id: user!.id,
      });
      if (error) throw error;
    },
    onSuccess: () => toast.success('Invitation sent'),
    onError: (e: Error) => toast.error(e.message),
  });

  return { groupQuery, membersQuery, myMembershipQuery, postsQuery, createGroupPost, inviteUser };
};
