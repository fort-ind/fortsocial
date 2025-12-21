
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const RightSidebar = () => {
  return (
    <div className="hidden lg:block w-60 pt-4 pl-4">
      <div className="sticky top-16 space-y-4">
        <Card className="material-card overflow-hidden">
          <div className="p-3 border-b border-border bg-muted">
            <h3 className="font-medium text-sm text-foreground">Start a hangout</h3>
          </div>
          <div className="p-3">
            <Button 
              variant="material"
              className="w-full"
              size="sm"
            >
              Start a hangout
            </Button>
          </div>
        </Card>
        
        <Card className="material-card overflow-hidden">
          <div className="p-3 border-b border-border bg-muted">
            <h3 className="font-medium text-sm text-foreground">People in circles</h3>
          </div>
          <div className="p-3">
            <div className="space-y-2">
              {['Matthew Wroblewski', 'Jan Stordiau', 'Rowan Finch', 'Alice Chang', 'Amy Fish', 'Andy Hertzfeld', 'Christopher Johnson'].map((name, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Avatar className="h-6 w-6 mr-2 shadow-material-1">
                      <AvatarImage src="/placeholder.svg" />
                      <AvatarFallback className="bg-secondary text-secondary-foreground text-xs">{name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-foreground">{name}</span>
                  </div>
                  <Button 
                    variant="material"
                    size="sm"
                    className="h-6 text-xs px-2"
                  >
                    Follow
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </Card>
        
        <Card className="material-card overflow-hidden">
          <div className="p-3 border-b border-border bg-muted">
            <h3 className="font-medium text-sm text-foreground">Trending on fort.social</h3>
          </div>
          <div className="p-3">
            <div className="space-y-2">
              {['#Pokemon', 'Wrestlemania', 'Justin Bieber', 'The Hunger Games', 'Instagram'].map((topic, i) => (
                <div key={i} className="text-sm text-primary hover:text-primary/80 cursor-pointer transition-colors">
                  {topic}
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default RightSidebar;
