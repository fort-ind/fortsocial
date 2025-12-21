
import React from 'react';
import { MessageCircle, Share2, MoreHorizontal } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface PostCardProps {
  user: {
    name: string;
    avatar: string;
    handle: string;
  };
  content: {
    text: string;
    image?: string;
    timestamp: string;
  };
  engagement: {
    likes: number;
    comments: number;
    shares: number;
  };
}

const PostCard: React.FC<PostCardProps> = ({
  user,
  content,
  engagement
}) => {
  return (
    <Card className="material-card bg-card overflow-hidden max-w-2xl mx-auto">
      <div className="flex items-start p-4 pb-2">
        <Avatar className="h-10 w-10 mr-3 shadow-material-1">
          <AvatarImage src={user.avatar} alt={user.name} />
          <AvatarFallback className="bg-secondary text-secondary-foreground">{user.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col flex-1">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-medium text-primary">{user.name}</span>
              <span className="text-xs text-muted-foreground ml-2">{content.timestamp}</span>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
          <div className="text-xs text-muted-foreground">Public</div>
        </div>
      </div>
      
      <div className="px-4 py-2">
        <p className="mb-3 text-sm text-card-foreground">{content.text}</p>
        {content.image && (
          <div className="overflow-hidden mb-3 rounded-sm shadow-material-1">
            <img src={content.image} alt="Post" className="w-full" />
          </div>
        )}
      </div>
      
      <div className="px-4 py-2 border-t border-border flex items-center space-x-1 text-sm">
        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary hover:bg-primary/10">
          <span className="font-semibold text-primary">+1</span>
          <span className="ml-1">{engagement.likes}</span>
        </Button>
        
        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground hover:bg-muted flex items-center">
          <MessageCircle className="mr-1 h-4 w-4" />
          <span>{engagement.comments}</span>
        </Button>
        
        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground hover:bg-muted flex items-center">
          <Share2 className="mr-1 h-4 w-4" />
          <span>{engagement.shares}</span>
        </Button>
      </div>
      
      <div className="px-4 py-3 border-t border-border flex items-center">
        <Avatar className="h-8 w-8 mr-2 shadow-material-1">
          <AvatarImage src="/placeholder.svg" alt="Comment" />
          <AvatarFallback className="bg-secondary text-secondary-foreground">U</AvatarFallback>
        </Avatar>
        <input 
          type="text" 
          placeholder="Add a comment..." 
          className="w-full material-input px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 rounded-sm" 
        />
      </div>
    </Card>
  );
};

export default PostCard;
