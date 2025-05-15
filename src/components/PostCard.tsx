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
  return <Card className="skeumorphic-card bg-white shadow-sm rounded-sm overflow-hidden border border-gray-200 max-w-2xl mx-auto transition-all hover:shadow-md">
      <div className="flex items-start p-4 pb-2">
        <Avatar className="h-10 w-10 mr-3 border border-gray-200 shadow-sm">
          <AvatarImage src={user.avatar} alt={user.name} />
          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col flex-1">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-bold text-blue-700">{user.name}</span>
              <span className="text-xs text-gray-500 ml-2">{content.timestamp}</span>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:bg-gray-100 hover:shadow-sm rounded-full transition-all">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
          <div className="text-xs text-gray-500">Public</div>
        </div>
      </div>
      
      <div className="px-4 py-2">
        <p className="mb-3 text-sm">{content.text}</p>
        {content.image && <div className="overflow-hidden mb-3 border border-gray-200 shadow-sm">
            
          </div>}
      </div>
      
      <div className="px-4 py-2 border-t flex items-center space-x-2 text-sm bg-gray-50">
        <Button variant="ghost" size="sm" className="text-gray-600 hover:bg-gray-100 hover:shadow-sm transition-all">
          <span className="font-semibold">+1</span>
          <span className="ml-1 text-gray-500">{engagement.likes}</span>
        </Button>
        
        <span className="text-gray-300">|</span>
        
        <Button variant="ghost" size="sm" className="text-gray-600 hover:bg-gray-100 hover:shadow-sm transition-all flex items-center">
          <MessageCircle className="mr-1 h-4 w-4" />
          <span className="text-gray-500">{engagement.comments}</span>
        </Button>
        
        <span className="text-gray-300">|</span>
        
        <Button variant="ghost" size="sm" className="text-gray-600 hover:bg-gray-100 hover:shadow-sm transition-all flex items-center">
          <Share2 className="mr-1 h-4 w-4" />
          <span className="text-gray-500">{engagement.shares}</span>
        </Button>
      </div>
      
      <div className="px-4 py-2 bg-gray-50 flex items-center">
        <Avatar className="h-8 w-8 mr-2 border border-gray-200 shadow-sm">
          <AvatarImage src="/placeholder.svg" alt="Comment" />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
        <input type="text" placeholder="Add a comment..." className="w-full bg-transparent border-0 focus:outline-none text-sm skeumorphic-input rounded-md px-2 py-1 inset" />
      </div>
    </Card>;
};
export default PostCard;