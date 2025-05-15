
import React, { useState } from 'react';
import { Image, Smile, Users, MapPin, Send } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';

const CreatePostCard = () => {
  const [postText, setPostText] = useState('');
  
  const handleSubmit = () => {
    console.log('Posting:', postText);
    setPostText('');
    // In a real app, this would send the post to an API
  };
  
  return (
    <Card className="skeumorphic-card bg-white shadow-sm mb-5 rounded-sm overflow-hidden border border-gray-200 max-w-2xl mx-auto">
      <div className="p-4 pb-2">
        <div className="flex gap-3">
          <Avatar className="h-10 w-10 border border-gray-200 shadow-sm">
            <AvatarImage src="/placeholder.svg" alt="Profile" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <div className="flex-1 bg-[#f5f5f5] rounded-sm p-2 inset">
            <Textarea
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
              placeholder="Share what's new..."
              className="resize-none border-none focus-visible:ring-0 p-0 h-16 text-base bg-transparent"
            />
          </div>
        </div>
      </div>
      
      <div className="px-4 pb-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" className="text-gray-600 rounded-full hover:bg-gray-100 p-1 hover:shadow-sm transition-all">
            <Image className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="sm" className="text-gray-600 rounded-full hover:bg-gray-100 p-1 hover:shadow-sm transition-all">
            <Users className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="sm" className="text-gray-600 rounded-full hover:bg-gray-100 p-1 hover:shadow-sm transition-all">
            <Smile className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="sm" className="text-gray-600 rounded-full hover:bg-gray-100 p-1 hover:shadow-sm transition-all">
            <MapPin className="h-5 w-5" />
          </Button>
        </div>
        
        <Button 
          onClick={handleSubmit} 
          disabled={!postText.trim()}
          className="bg-blue-500 hover:bg-blue-600 text-white rounded-sm shadow-sm hover:shadow-md hover:translate-y-[-1px] transition-all"
        >
          Share
        </Button>
      </div>
    </Card>
  );
};

export default CreatePostCard;
