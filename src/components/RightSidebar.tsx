
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const RightSidebar = () => {
  return (
    <div className="hidden lg:block w-72 pt-4 pl-4">
      <div className="sticky top-16">
        <Card className="shadow-sm mb-4">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium">People in your circles</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <Avatar key={i} className="h-10 w-10 border-2 border-white hover:scale-110 transition-transform cursor-pointer">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback>{String.fromCharCode(64 + i)}</AvatarFallback>
                </Avatar>
              ))}
            </div>
            <Button variant="ghost" className="w-full text-primary text-sm mt-3">
              View all connections
            </Button>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm mb-4">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium">Suggested connections</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Avatar className="h-8 w-8 mr-2">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback>S</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">Sarah Price</p>
                  <p className="text-xs text-gray-500">Product Designer</p>
                </div>
              </div>
              <Button variant="outline" className="h-7 text-xs rounded-full px-3">
                Add
              </Button>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Avatar className="h-8 w-8 mr-2">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback>J</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">Jacky Hayward</p>
                  <p className="text-xs text-gray-500">UX Engineer</p>
                </div>
              </div>
              <Button variant="outline" className="h-7 text-xs rounded-full px-3">
                Add
              </Button>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Avatar className="h-8 w-8 mr-2">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback>K</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">Kelly Fee</p>
                  <p className="text-xs text-gray-500">Product Manager</p>
                </div>
              </div>
              <Button variant="outline" className="h-7 text-xs rounded-full px-3">
                Add
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium">Hangouts</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 mb-3">
              Start a hangout
            </Button>
            <p className="text-xs text-gray-500 text-center">
              No one is hanging out right now. Be the first to start!
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RightSidebar;
