
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

const PostCard: React.FC<PostCardProps> = ({ user, content, engagement }) => {
  return (
    <Card className="bg-white shadow-sm rounded-md overflow-hidden border border-gray-200">
      <div className="flex items-start p-4 pb-2">
        <Avatar className="h-12 w-12 mr-3">
          <AvatarImage src={user.avatar} alt={user.name} />
          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col flex-1">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-medium text-blue-600">{user.name}</span>
              <span className="text-xs text-gray-500 ml-2">{content.timestamp}</span>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
          <div className="text-sm text-gray-500">@{user.handle}</div>
        </div>
      </div>
      
      <div className="px-4 py-2">
        <p className="mb-3">{content.text}</p>
        {content.image && (
          <div className="rounded-md overflow-hidden mb-3">
            <img src={content.image} alt="Post content" className="w-full h-auto" />
          </div>
        )}
      </div>
      
      <div className="px-4 py-2 border-t flex items-center space-x-4">
        <Button variant="ghost" size="sm" className="text-gray-600 px-3 rounded-full hover:bg-gray-100">
          <span className="mr-2">+1</span>
          <span className="text-gray-500 text-sm">{engagement.likes}</span>
        </Button>
        
        <Button variant="ghost" size="sm" className="text-gray-600 px-3 rounded-full hover:bg-gray-100">
          <MessageCircle className="mr-2 h-4 w-4" />
          <span className="text-gray-500 text-sm">{engagement.comments}</span>
        </Button>
        
        <Button variant="ghost" size="sm" className="text-gray-600 px-3 rounded-full hover:bg-gray-100">
          <Share2 className="mr-2 h-4 w-4" />
          <span className="text-gray-500 text-sm">{engagement.shares}</span>
        </Button>
      </div>
    </Card>
  );
};

export default PostCard;
