
import React from 'react';
import { Link } from 'react-router-dom';
import { Bell, Search } from 'lucide-react';
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
            <div className="text-xl font-bold text-blue-600 flex items-center">
              <span className="text-[#dd4b39] font-bold mr-1">fort</span>
              <span className="text-[#dd4b39]">.</span>
              <span className="text-[#dd4b39] font-bold">social</span>
            </div>
          </Link>
        </div>

        {/* Search */}
        <div className="flex items-center flex-1 max-w-lg mx-6">
          <div className="relative w-full">
            <Input
              type="search"
              placeholder="Search fort.social"
              className="pl-4 pr-10 bg-gray-100 border border-gray-300 rounded-sm focus-visible:ring-primary inset skeumorphic-input"
            />
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute right-0 top-0 h-full bg-blue-500 rounded-l-none rounded-r-sm shadow-sm hover:shadow-md hover:translate-y-[-1px] transition-all"
            >
              <Search className="h-4 w-4 text-white" />
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            className="relative rounded-full hover:bg-gray-100 shadow-sm hover:shadow-md hover:translate-y-[-1px] transition-all"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center shadow-sm">2</span>
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="bg-blue-500 hover:bg-blue-600 text-white rounded-sm px-4 shadow-sm hover:shadow-md hover:translate-y-[-1px] transition-all"
          >
            Share
          </Button>
          
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8 cursor-pointer border border-gray-200 shadow-sm">
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <span className="hidden md:inline font-medium text-sm">Alex Smith ▾</span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
