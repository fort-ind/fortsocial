
import React from 'react';
import { Link } from 'react-router-dom';
import { Bell, Search, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useIsMobile } from '@/hooks/use-mobile';

const Navbar = () => {
  const isMobile = useIsMobile();
  
  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm py-2">
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <div className="text-2xl font-bold text-blue-600">
              <span className="text-primary">fort</span><span className="text-blue-600">.</span><span className="text-primary">social</span>
            </div>
          </Link>
        </div>

        {/* Search */}
        <div className="hidden md:flex items-center flex-1 max-w-lg mx-6">
          <div className="relative w-full">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              type="search"
              placeholder="Search fort.social"
              className="pl-8 bg-gray-100 border-0 focus-visible:ring-primary rounded-full"
            />
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-4">
            <Button variant="ghost" size="sm" className="text-gray-700">Home</Button>
            <Button variant="ghost" size="sm" className="text-gray-700">Profile</Button>
            <Button variant="ghost" size="sm" className="text-gray-700">Explore</Button>
          </div>
          
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">2</span>
          </Button>
          
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8 cursor-pointer">
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <span className="hidden md:inline font-medium text-sm">Alex Smith</span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
