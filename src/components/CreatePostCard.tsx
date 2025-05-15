
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
    <Card className="bg-white shadow-sm mb-5 rounded-md overflow-hidden border border-gray-200">
      <div className="p-4">
        <div className="flex gap-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src="/placeholder.svg" alt="Profile" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <Textarea
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
              placeholder="Share something with your circles..."
              className="resize-none border-none focus-visible:ring-0 p-0 h-24 text-lg"
            />
          </div>
        </div>
      </div>
      
      <div className="px-4 pb-4 pt-2 border-t flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" className="text-gray-600 hover:text-primary">
            <Image className="mr-1 h-4 w-4" />
            <span className="text-sm">Photo</span>
          </Button>
          <Button variant="ghost" size="sm" className="text-gray-600 hover:text-primary">
            <Users className="mr-1 h-4 w-4" />
            <span className="text-sm">Circles</span>
          </Button>
          <Button variant="ghost" size="sm" className="text-gray-600 hover:text-primary">
            <Smile className="mr-1 h-4 w-4" />
            <span className="text-sm">Mood</span>
          </Button>
          <Button variant="ghost" size="sm" className="text-gray-600 hover:text-primary">
            <MapPin className="mr-1 h-4 w-4" />
            <span className="text-sm">Location</span>
          </Button>
        </div>
        
        <Button 
          onClick={handleSubmit} 
          variant="outline"
          className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 px-6"
          disabled={!postText.trim()}
        >
          Share
        </Button>
      </div>
      
      <div className="px-4 py-2 border-t flex items-center text-sm">
        <span className="text-gray-500 mr-2">To:</span>
        <div className="flex items-center bg-gray-100 rounded-full px-3 py-1 text-sm mr-2">
          <span>Circles</span>
          <span className="ml-1">▾</span>
        </div>
        <span className="text-primary cursor-pointer">+ Add more people</span>
      </div>
    </Card>
  );
};

export default CreatePostCard;
