import React, { useState } from 'react';
import { MessageCircle, Share2, MoreHorizontal, Trash2, Music } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { usePosts, PostWithDetails } from '@/hooks/usePosts';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';
import FollowButton from '@/components/FollowButton';

interface PostCardProps {
  post: PostWithDetails;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const { user } = useAuth();
  const { toggleLike, addComment, deleteComment } = usePosts();
  const [commentText, setCommentText] = useState('');
  const [showComments, setShowComments] = useState(false);
  const { toast } = useToast();

  const isLiked = post.likes?.some(l => l.user_id === user?.id);
  const likeCount = post.likes?.length ?? 0;
  const commentCount = post.comments?.length ?? 0;

  const handleLike = () => {
    if (!user) return;
    toggleLike.mutate(post.id);
  };

  const handleComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !user) return;
    addComment.mutate({ postId: post.id, content: commentText });
    setCommentText('');
    setShowComments(true);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.origin + '/?post=' + post.id);
    toast({ title: 'Link copied to clipboard!' });
  };

  const timeAgo = formatDistanceToNow(new Date(post.created_at), { addSuffix: true });

  return (
    <Card className="material-card bg-card overflow-hidden max-w-2xl mx-auto">
      <div className="flex items-start p-4 pb-2">
        <Avatar className="h-10 w-10 mr-3 shadow-material-1">
          <AvatarImage src={post.profiles?.avatar_url || '/placeholder.svg'} alt={post.profiles?.display_name} />
          <AvatarFallback className="bg-secondary text-secondary-foreground">{post.profiles?.display_name?.charAt(0) || 'U'}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col flex-1">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-medium text-primary">{post.profiles?.display_name}</span>
              <span className="text-xs text-muted-foreground ml-2">{timeAgo}</span>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
          <div className="text-xs text-muted-foreground">@{post.profiles?.handle}</div>
        </div>
      </div>
      
      <div className="px-4 py-2">
        <p className="mb-3 text-sm text-card-foreground">{post.content}</p>
        {post.image_url && (
          <div className="overflow-hidden mb-3 rounded-sm shadow-material-1">
            <img src={post.image_url} alt="Post" className="w-full" />
          </div>
        )}
      </div>
      
      <div className="px-4 py-2 border-t border-border flex items-center space-x-1 text-sm">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleLike}
          className={`hover:bg-primary/10 ${isLiked ? 'text-primary' : 'text-muted-foreground'}`}
        >
          <span className="font-semibold">+1</span>
          <span className="ml-1">{likeCount}</span>
        </Button>
        
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setShowComments(!showComments)}
          className="text-muted-foreground hover:text-foreground hover:bg-muted flex items-center"
        >
          <MessageCircle className="mr-1 h-4 w-4" />
          <span>{commentCount}</span>
        </Button>
        
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleShare}
          className="text-muted-foreground hover:text-foreground hover:bg-muted flex items-center"
        >
          <Share2 className="mr-1 h-4 w-4" />
          <span>Share</span>
        </Button>
      </div>

      {showComments && post.comments && post.comments.length > 0 && (
        <div className="px-4 py-2 border-t border-border space-y-2">
          {post.comments.map((comment) => (
            <div key={comment.id} className="flex items-start gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={comment.profiles?.avatar_url || '/placeholder.svg'} />
                <AvatarFallback className="bg-secondary text-secondary-foreground text-xs">{comment.profiles?.display_name?.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 bg-muted rounded-sm p-2">
                <span className="text-xs font-medium text-primary">{comment.profiles?.display_name}</span>
                <p className="text-sm text-card-foreground">{comment.content}</p>
              </div>
              {comment.user_id === user?.id && (
                <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground" onClick={() => deleteComment.mutate(comment.id)}>
                  <Trash2 className="h-3 w-3" />
                </Button>
              )}
            </div>
          ))}
        </div>
      )}
      
      <form onSubmit={handleComment} className="px-4 py-3 border-t border-border flex items-center">
        <Avatar className="h-8 w-8 mr-2 shadow-material-1">
          <AvatarImage src="/placeholder.svg" alt="Comment" />
          <AvatarFallback className="bg-secondary text-secondary-foreground">U</AvatarFallback>
        </Avatar>
        <input 
          type="text" 
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Add a comment..." 
          className="w-full material-input px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 rounded-sm" 
        />
      </form>
    </Card>
  );
};

export default PostCard;
