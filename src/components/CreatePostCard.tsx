
import React, { useState } from 'react';
import { Image, Smile, Users, MapPin, Send } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';

const CreatePostCard = () => {
  const [postText, setPostText] = useState('');
  
  const handleSubmit = () => {
    console.log('Posting:', postText);
    setPostText('');
    // In a real app, this would send the post to an API
  };
  
  return (
    <Card className="post-card mb-4">
      <CardContent className="pt-4">
        <div className="flex gap-3">
          <Avatar>
            <AvatarImage src="/placeholder.svg" alt="Profile" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <Textarea
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
              placeholder="Share something with your circles..."
              className="resize-none border-none focus-visible:ring-0 p-0 h-24"
            />
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t pt-3 flex flex-wrap items-center justify-between gap-2">
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
          className="bg-primary hover:bg-primary/90"
          disabled={!postText.trim()}
        >
          <Send className="mr-1 h-4 w-4" />
          Post
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CreatePostCard;
