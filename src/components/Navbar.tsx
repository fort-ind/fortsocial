
import React from 'react';
import { Link } from 'react-router-dom';
import { Bell, Home, Users, Search, Menu, User, MessageCircle } from 'lucide-react';
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
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xl">+</div>
            <span className="ml-2 text-lg font-medium hidden md:block">PlusNet</span>
          </Link>
        </div>

        {/* Search - hide on mobile */}
        {!isMobile && (
          <div className="hidden md:flex items-center flex-1 max-w-md mx-6">
            <div className="relative w-full">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                type="search"
                placeholder="Search PlusNet"
                className="pl-8 bg-gray-100 border-0 focus-visible:ring-primary"
              />
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center gap-1 md:gap-2">
          <Button variant="ghost" size="icon" className="circle-icon">
            <Home className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="circle-icon">
            <Users className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="circle-icon">
            <MessageCircle className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="circle-icon">
            <Bell className="h-5 w-5" />
          </Button>
          <Avatar className="h-8 w-8 cursor-pointer">
            <AvatarImage src="/placeholder.svg" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
