
import React from 'react';
import { Heart, MessageCircle, Share2, MoreHorizontal } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';

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

const PostCard: React.FC<PostCardProps> = ({ user, content, engagement }) => {
  return (
    <Card className="post-card mb-4 animate-fade-in">
      <CardHeader className="flex flex-row items-center space-y-0 pt-4 pb-2">
        <div className="flex items-start space-x-3">
          <Avatar>
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-medium">{user.name}</span>
              <span className="text-sm text-gray-500">@{user.handle}</span>
            </div>
            <span className="text-xs text-gray-500">{content.timestamp}</span>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="ml-auto">
          <MoreHorizontal className="h-5 w-5" />
        </Button>
      </CardHeader>
      <CardContent className="pt-2 pb-3">
        <p className="mb-3">{content.text}</p>
        {content.image && (
          <div className="rounded-lg overflow-hidden">
            <img src={content.image} alt="Post content" className="w-full h-auto" />
          </div>
        )}
      </CardContent>
      <CardFooter className="border-t pt-2 pb-3 flex items-center justify-between">
        <div className="flex items-center space-x-1">
          <Button variant="ghost" size="sm" className="text-gray-600 hover:text-primary px-2">
            <Heart className="mr-1 h-4 w-4" />
            <span className="text-sm">{engagement.likes}</span>
          </Button>
        </div>
        <div className="flex items-center space-x-1">
          <Button variant="ghost" size="sm" className="text-gray-600 hover:text-primary px-2">
            <MessageCircle className="mr-1 h-4 w-4" />
            <span className="text-sm">{engagement.comments}</span>
          </Button>
        </div>
        <div className="flex items-center space-x-1">
          <Button variant="ghost" size="sm" className="text-gray-600 hover:text-primary px-2">
            <Share2 className="mr-1 h-4 w-4" />
            <span className="text-sm">{engagement.shares}</span>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default PostCard;
