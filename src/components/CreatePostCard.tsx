
import React, { useState } from 'react';
import { Image, Smile, Users, MapPin } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';

const CreatePostCard = () => {
  const [postText, setPostText] = useState('');
  
  const handleSubmit = () => {
    console.log('Posting:', postText);
    setPostText('');
  };
  
  return (
    <Card className="material-card bg-card mb-5 overflow-hidden max-w-2xl mx-auto">
      <div className="p-4 pb-2">
        <div className="flex gap-3">
          <Avatar className="h-10 w-10 shadow-material-1">
            <AvatarImage src="/placeholder.svg" alt="Profile" />
            <AvatarFallback className="bg-secondary text-secondary-foreground">U</AvatarFallback>
          </Avatar>
          <div className="flex-1 bg-muted rounded-sm p-2">
            <Textarea
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
              placeholder="Share what's new..."
              className="resize-none border-none focus-visible:ring-0 p-0 h-16 text-base bg-transparent text-foreground placeholder:text-muted-foreground"
            />
          </div>
        </div>
      </div>
      
      <div className="px-4 pb-4 flex items-center justify-between">
        <div className="flex items-center space-x-1">
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground hover:bg-muted">
            <Image className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground hover:bg-muted">
            <Users className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground hover:bg-muted">
            <Smile className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground hover:bg-muted">
            <MapPin className="h-5 w-5" />
          </Button>
        </div>
        
        <Button 
          onClick={handleSubmit} 
          disabled={!postText.trim()}
          variant="material"
          size="sm"
        >
          Share
        </Button>
      </div>
    </Card>
  );
};

export default CreatePostCard;
