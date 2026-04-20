import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface PostWithDetails {
  id: string;
  user_id: string;
  content: string;
  image_url: string | null;
  created_at: string;
  profiles: {
    display_name: string;
    avatar_url: string | null;
    handle: string | null;
    personal_message?: string | null;
    mood?: string | null;
    now_playing?: string | null;
    is_private?: boolean | null;
  };
  likes: { id: string; user_id: string }[];
  comments: { id: string; user_id: string; content: string; created_at: string; profiles: { display_name: string; avatar_url: string | null } }[];
}

export const usePosts = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const postsQuery = useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          profiles!posts_user_id_fkey(display_name, avatar_url, handle, personal_message, mood, now_playing, is_private),
          likes(id, user_id),
          comments(id, user_id, content, created_at, profiles!comments_user_id_fkey(display_name, avatar_url))
        `)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as unknown as PostWithDetails[];
    },
  });

  const createPost = useMutation({
    mutationFn: async ({ content, imageFile }: { content: string; imageFile?: File }) => {
      let imageUrl: string | null = null;

      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const filePath = `${user!.id}/${crypto.randomUUID()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('post-images')
          .upload(filePath, imageFile);
        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from('post-images')
          .getPublicUrl(filePath);
        imageUrl = urlData.publicUrl;
      }

      const { error } = await supabase.from('posts').insert({
        user_id: user!.id,
        content,
        image_url: imageUrl,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      toast({ title: 'Post shared!' });
    },
    onError: (e: Error) => toast({ title: 'Error', description: e.message, variant: 'destructive' }),
  });

  const toggleLike = useMutation({
    mutationFn: async (postId: string) => {
      const existingLike = await supabase
        .from('likes')
        .select('id')
        .eq('post_id', postId)
        .eq('user_id', user!.id)
        .maybeSingle();

      if (existingLike.data) {
        await supabase.from('likes').delete().eq('id', existingLike.data.id);
      } else {
        await supabase.from('likes').insert({ post_id: postId, user_id: user!.id });
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['posts'] }),
  });

  const addComment = useMutation({
    mutationFn: async ({ postId, content }: { postId: string; content: string }) => {
      const { error } = await supabase.from('comments').insert({
        post_id: postId,
        user_id: user!.id,
        content,
      });
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['posts'] }),
  });

  const deleteComment = useMutation({
    mutationFn: async (commentId: string) => {
      const { error } = await supabase.from('comments').delete().eq('id', commentId);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['posts'] }),
  });

  return { postsQuery, createPost, toggleLike, addComment, deleteComment };
};
