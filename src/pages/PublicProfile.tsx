import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import FollowButton from '@/components/FollowButton';
import PostCard from '@/components/PostCard';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft, Lock, Music } from 'lucide-react';

const PublicProfile = () => {
  const { handle } = useParams<{ handle: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const cleanHandle = (handle || '').replace(/^@/, '');

  const profileQuery = useQuery({
    queryKey: ['public-profile', cleanHandle],
    enabled: !!cleanHandle,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('handle', cleanHandle)
        .maybeSingle();
      if (error) throw error;
      return data as any;
    },
  });

  const profile = profileQuery.data;

  const followerCountQuery = useQuery({
    queryKey: ['follower-count', profile?.id],
    enabled: !!profile?.id,
    queryFn: async () => {
      const { count } = await supabase
        .from('follows')
        .select('id', { count: 'exact', head: true })
        .eq('following_id', profile.id)
        .eq('status', 'accepted');
      return count ?? 0;
    },
  });

  const followingCountQuery = useQuery({
    queryKey: ['following-count', profile?.id],
    enabled: !!profile?.id,
    queryFn: async () => {
      const { count } = await supabase
        .from('follows')
        .select('id', { count: 'exact', head: true })
        .eq('follower_id', profile.id)
        .eq('status', 'accepted');
      return count ?? 0;
    },
  });

  const amFollowingQuery = useQuery({
    queryKey: ['am-following', user?.id, profile?.id],
    enabled: !!user && !!profile?.id && user.id !== profile.id,
    queryFn: async () => {
      const { data } = await supabase
        .from('follows')
        .select('status')
        .eq('follower_id', user!.id)
        .eq('following_id', profile.id)
        .maybeSingle();
      return data?.status === 'accepted';
    },
  });

  const canSeePosts =
    !!profile && (!profile.is_private || profile.id === user?.id || amFollowingQuery.data === true);

  const postsQuery = useQuery({
    queryKey: ['user-posts', profile?.id, canSeePosts],
    enabled: !!profile?.id && canSeePosts,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          profiles!posts_user_id_fkey(display_name, avatar_url, handle, personal_message, mood, now_playing, is_private),
          likes(id, user_id),
          comments(id, user_id, content, created_at, profiles!comments_user_id_fkey(display_name, avatar_url))
        `)
        .eq('user_id', profile.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as any[];
    },
  });

  if (profileQuery.isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <p className="text-center mt-10 text-muted-foreground">Loading…</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-2xl mx-auto p-6">
          <Button variant="ghost" onClick={() => navigate('/')}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Home
          </Button>
          <p className="mt-4 text-muted-foreground">No user found with handle @{cleanHandle}.</p>
        </div>
      </div>
    );
  }

  const isMe = user?.id === profile.id;
  const initials = (profile.display_name || 'U').slice(0, 2).toUpperCase();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Button>

        <Card className="p-6">
          <div className="flex items-start gap-4">
            <Avatar className="w-20 h-20">
              <AvatarImage src={profile.avatar_url || undefined} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h1 className="text-xl font-bold truncate">
                    {profile.mood && <span className="mr-1">{profile.mood}</span>}
                    {profile.display_name}
                    {profile.is_private && <Lock className="inline w-4 h-4 ml-1 text-muted-foreground" />}
                  </h1>
                  <p className="text-sm text-muted-foreground">@{profile.handle}</p>
                  {profile.personal_message && (
                    <p className="text-sm italic text-muted-foreground mt-1">— {profile.personal_message}</p>
                  )}
                  {profile.now_playing && (
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                      <Music className="w-3 h-3" /> {profile.now_playing}
                    </p>
                  )}
                </div>
                <div className="shrink-0">
                  {isMe ? (
                    <Button size="sm" variant="outline" asChild>
                      <Link to="/profile">Edit profile</Link>
                    </Button>
                  ) : (
                    <FollowButton targetUserId={profile.id} targetIsPrivate={profile.is_private} />
                  )}
                </div>
              </div>

              {profile.bio && <p className="text-sm mt-3 whitespace-pre-wrap">{profile.bio}</p>}

              <div className="flex gap-4 mt-3 text-sm">
                <span><strong>{followerCountQuery.data ?? 0}</strong> <span className="text-muted-foreground">followers</span></span>
                <span><strong>{followingCountQuery.data ?? 0}</strong> <span className="text-muted-foreground">following</span></span>
              </div>
            </div>
          </div>
        </Card>

        <h2 className="text-lg font-semibold">Posts</h2>
        {!canSeePosts ? (
          <Card className="p-6 text-center text-sm text-muted-foreground">
            <Lock className="w-5 h-5 mx-auto mb-2" />
            This account is private. Follow to see their posts.
          </Card>
        ) : postsQuery.isLoading ? (
          <p className="text-center text-muted-foreground">Loading…</p>
        ) : (postsQuery.data ?? []).length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">No posts yet.</p>
        ) : (
          <div className="space-y-4">
            {postsQuery.data!.map((p) => <PostCard key={p.id} post={p} />)}
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicProfile;
