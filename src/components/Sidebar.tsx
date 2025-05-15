
import React from 'react';
import { Home, Users, BookUser, Flag, User, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, label, active }) => {
  return (
    <div 
      className={cn(
        "flex items-center p-2 rounded-lg cursor-pointer transition-colors", 
        active ? "bg-gray-100 text-primary font-medium" : "hover:bg-gray-50"
      )}
    >
      <div className="mr-3">{icon}</div>
      <span>{label}</span>
    </div>
  );
};

const Sidebar = () => {
  return (
    <div className="hidden md:block w-60 p-4">
      <div className="space-y-1 mb-6">
        <SidebarItem icon={<Home className="h-5 w-5" />} label="Home" active />
        <SidebarItem icon={<User className="h-5 w-5" />} label="Profile" />
        <SidebarItem icon={<MessageCircle className="h-5 w-5" />} label="Messages" />
      </div>
      
      <div className="pt-4 border-t">
        <div className="text-sm font-medium text-gray-500 mb-2">Circles</div>
        <div className="space-y-1">
          <SidebarItem icon={<Users className="h-5 w-5" />} label="Friends" />
          <SidebarItem icon={<Users className="h-5 w-5" />} label="Family" />
          <SidebarItem icon={<Users className="h-5 w-5" />} label="Work" />
          <SidebarItem icon={<Users className="h-5 w-5 text-primary" />} label="Create Circle" />
        </div>
      </div>
      
      <div className="pt-4 border-t">
        <div className="text-sm font-medium text-gray-500 mb-2">Communities</div>
        <div className="space-y-1">
          <SidebarItem icon={<BookUser className="h-5 w-5" />} label="Technology" />
          <SidebarItem icon={<BookUser className="h-5 w-5" />} label="Photography" />
          <SidebarItem icon={<BookUser className="h-5 w-5" />} label="Travel" />
          <SidebarItem icon={<Flag className="h-5 w-5 text-primary" />} label="Discover" />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
