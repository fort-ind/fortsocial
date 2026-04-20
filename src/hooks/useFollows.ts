import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export type FollowStatus = 'pending' | 'accepted';

export interface FollowRow {
  id: string;
  follower_id: string;
  following_id: string;
  status: FollowStatus;
}

export const useFollows = (targetUserId?: string) => {
  const { user } = useAuth();
  const qc = useQueryClient();

  const followingIdsQuery = useQuery({
    queryKey: ['following-ids', user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('follows')
        .select('following_id, status')
        .eq('follower_id', user!.id);
      if (error) throw error;
      return data;
    },
  });

  const relationQuery = useQuery({
    queryKey: ['follow-rel', user?.id, targetUserId],
    enabled: !!user && !!targetUserId && targetUserId !== user?.id,
    queryFn: async () => {
      const { data } = await supabase
        .from('follows')
        .select('*')
        .eq('follower_id', user!.id)
        .eq('following_id', targetUserId!)
        .maybeSingle();
      return data as FollowRow | null;
    },
  });

  const pendingIncomingQuery = useQuery({
    queryKey: ['follow-incoming', user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('follows')
        .select('*, profiles:profiles!follows_follower_id_fkey(display_name, avatar_url, handle)')
        .eq('following_id', user!.id)
        .eq('status', 'pending');
      if (error) return [];
      return data as any[];
    },
  });

  const follow = useMutation({
    mutationFn: async ({ targetId, isPrivate }: { targetId: string; isPrivate: boolean }) => {
      const status: FollowStatus = isPrivate ? 'pending' : 'accepted';
      const { error } = await supabase.from('follows').insert({
        follower_id: user!.id,
        following_id: targetId,
        status,
      });
      if (error) throw error;
      return status;
    },
    onSuccess: (status) => {
      qc.invalidateQueries({ queryKey: ['follow-rel'] });
      qc.invalidateQueries({ queryKey: ['following-ids'] });
      qc.invalidateQueries({ queryKey: ['posts'] });
      toast.success(status === 'pending' ? 'Follow request sent' : 'Now following');
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const unfollow = useMutation({
    mutationFn: async (targetId: string) => {
      const { error } = await supabase
        .from('follows')
        .delete()
        .eq('follower_id', user!.id)
        .eq('following_id', targetId);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['follow-rel'] });
      qc.invalidateQueries({ queryKey: ['following-ids'] });
      qc.invalidateQueries({ queryKey: ['posts'] });
    },
  });

  const acceptFollow = useMutation({
    mutationFn: async (rowId: string) => {
      const { error } = await supabase
        .from('follows')
        .update({ status: 'accepted' })
        .eq('id', rowId);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['follow-incoming'] });
      toast.success('Follow request accepted');
    },
  });

  const rejectFollow = useMutation({
    mutationFn: async (rowId: string) => {
      const { error } = await supabase.from('follows').delete().eq('id', rowId);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['follow-incoming'] }),
  });

  return {
    followingIdsQuery,
    relationQuery,
    pendingIncomingQuery,
    follow,
    unfollow,
    acceptFollow,
    rejectFollow,
  };
};
