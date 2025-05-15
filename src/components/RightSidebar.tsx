
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const RightSidebar = () => {
  return (
    <div className="hidden lg:block w-60 pt-4 pl-4">
      <div className="sticky top-16">
        <Card className="skeumorphic-card shadow-sm mb-4 rounded-sm border border-gray-200">
          <div className="p-3 border-b border-gray-200 bg-gray-50 embossed">
            <h3 className="font-medium text-sm">Start a hangout</h3>
          </div>
          <div className="p-3">
            <Button 
              className="w-full bg-blue-500 text-white hover:bg-blue-600 rounded-sm text-sm mb-3 shadow-sm hover:shadow-md hover:translate-y-[-1px] transition-all"
            >
              Start a hangout
            </Button>
          </div>
        </Card>
        
        <Card className="skeumorphic-card shadow-sm mb-4 rounded-sm border border-gray-200">
          <div className="p-3 border-b border-gray-200 bg-gray-50 embossed">
            <h3 className="font-medium text-sm">People in circles</h3>
          </div>
          <div className="p-3">
            <div className="space-y-2">
              {['Matthew Wroblewski', 'Jan Stordiau', 'Rowan Finch', 'Alice Chang', 'Amy Fish', 'Andy Hertzfeld', 'Christopher Johnson'].map((name, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Avatar className="h-6 w-6 mr-2 border border-gray-200 shadow-sm">
                      <AvatarImage src="/placeholder.svg" />
                      <AvatarFallback>{name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{name}</span>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-6 text-xs bg-blue-500 text-white hover:bg-blue-600 rounded-sm px-2 shadow-sm hover:shadow-md hover:translate-y-[-1px] transition-all"
                  >
                    Follow
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </Card>
        
        <Card className="skeumorphic-card shadow-sm rounded-sm border border-gray-200">
          <div className="p-3 border-b border-gray-200 bg-gray-50 embossed">
            <h3 className="font-medium text-sm">Trending on Google+</h3>
          </div>
          <div className="p-3">
            <div className="space-y-2">
              {['#Pokemon', 'Wrestlemania', 'Justin Bieber', 'The Hunger Games', 'Instagram'].map((topic, i) => (
                <div key={i} className="text-sm text-blue-600 hover:underline cursor-pointer hover:text-blue-800 transition-colors">
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
