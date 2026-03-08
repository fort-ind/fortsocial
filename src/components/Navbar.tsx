import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, Search, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';

const Navbar = () => {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  return (
    <nav className="sticky top-0 z-50 bg-primary shadow-material-2 py-2">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <div className="text-xl font-bold flex items-center">
              <span className="text-primary-foreground font-bold mr-1">fort</span>
              <span className="text-primary-foreground">.</span>
              <span className="text-primary-foreground font-bold">social</span>
            </div>
          </Link>
        </div>

        <div className="flex items-center flex-1 max-w-lg mx-6">
          <div className="relative w-full">
            <Input 
              type="search" 
              placeholder="Search fort.social" 
              className="pl-4 pr-10 bg-card/90 border-0 rounded-sm shadow-material-1 focus-visible:ring-2 focus-visible:ring-card/50 placeholder:text-muted-foreground" 
            />
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute right-0 top-0 h-full rounded-l-none rounded-r-sm text-muted-foreground hover:text-foreground hover:bg-transparent"
            >
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="icon" 
            className="relative text-primary-foreground hover:bg-primary-foreground/10"
          >
            <Bell className="h-5 w-5" />
          </Button>
          
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8 cursor-pointer shadow-material-1">
              <AvatarImage src={profile?.avatar_url || '/placeholder.svg'} />
              <AvatarFallback className="bg-secondary text-secondary-foreground">{profile?.display_name?.charAt(0) || 'U'}</AvatarFallback>
            </Avatar>
            <span className="hidden md:inline font-medium text-sm text-primary-foreground">
              Hi, {profile?.display_name || 'User'} ▾
            </span>
          </div>

          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleSignOut}
            className="text-primary-foreground hover:bg-primary-foreground/10"
            title="Sign out"
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
