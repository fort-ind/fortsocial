
import React from 'react';
import { PlusCircle } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const TrendingTopic = ({ title, posts }: { title: string; posts: string }) => (
  <div className="py-2">
    <a href="#" className="hover:text-primary">
      <p className="font-medium">{title}</p>
      <p className="text-xs text-gray-500">{posts} posts</p>
    </a>
  </div>
);

const SuggestedUser = ({ name, avatar, mutual }: { name: string; avatar: string; mutual: number }) => (
  <div className="flex items-center justify-between py-2">
    <div className="flex items-center">
      <Avatar className="h-8 w-8 mr-2">
        <AvatarImage src={avatar} />
        <AvatarFallback>{name[0]}</AvatarFallback>
      </Avatar>
      <div>
        <p className="text-sm font-medium">{name}</p>
        <p className="text-xs text-gray-500">{mutual} mutual connections</p>
      </div>
    </div>
    <Button size="sm" variant="outline" className="h-8 rounded-full">
      <PlusCircle className="h-4 w-4 mr-1" />
      Add
    </Button>
  </div>
);

const CommunityCard = ({ name, image, members }: { name: string; image: string; members: string }) => (
  <div className="flex items-center justify-between py-2">
    <div className="flex items-center">
      <div className="h-8 w-8 mr-2 rounded overflow-hidden">
        <img src={image} alt={name} className="h-full w-full object-cover" />
      </div>
      <div>
        <p className="text-sm font-medium">{name}</p>
        <p className="text-xs text-gray-500">{members} members</p>
      </div>
    </div>
    <Button size="sm" variant="outline" className="h-8 rounded-full">
      Join
    </Button>
  </div>
);

const RightSidebar = () => {
  return (
    <div className="hidden lg:block w-72">
      <div className="sticky top-20 space-y-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Trending Topics</CardTitle>
          </CardHeader>
          <CardContent>
            <TrendingTopic title="Web Development" posts="5.2k" />
            <TrendingTopic title="Artificial Intelligence" posts="3.8k" />
            <TrendingTopic title="Photography Tips" posts="2.4k" />
            <TrendingTopic title="Remote Work" posts="1.9k" />
            <Button variant="ghost" className="w-full text-primary text-sm mt-2">
              Show more
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Suggested People</CardTitle>
          </CardHeader>
          <CardContent>
            <SuggestedUser name="Alex Johnson" avatar="/placeholder.svg" mutual={12} />
            <SuggestedUser name="Maria Garcia" avatar="/placeholder.svg" mutual={8} />
            <SuggestedUser name="David Kim" avatar="/placeholder.svg" mutual={3} />
            <Button variant="ghost" className="w-full text-primary text-sm mt-2">
              View all
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Suggested Communities</CardTitle>
          </CardHeader>
          <CardContent>
            <CommunityCard name="UX/UI Design" image="/placeholder.svg" members="8.2k" />
            <CommunityCard name="Travel Adventures" image="/placeholder.svg" members="12k" />
            <CommunityCard name="Food & Cooking" image="/placeholder.svg" members="5.7k" />
            <Button variant="ghost" className="w-full text-primary text-sm mt-2">
              Explore more
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RightSidebar;
