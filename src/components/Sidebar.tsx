
import React from 'react';
import { Home, User, Calendar, Image, Users, Flag, Map, Menu } from 'lucide-react';

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, label, active }) => {
  return (
    <div 
      className={`flex items-center p-2 rounded-lg cursor-pointer transition-all ${
        active ? "text-primary font-medium bg-gray-100 shadow-sm embossed" : "text-gray-600 hover:bg-gray-100 hover:shadow-sm"
      }`}
    >
      <div className="mr-3">{icon}</div>
      <span>{label}</span>
    </div>
  );
};

const Sidebar = () => {
  return (
    <div className="hidden md:block w-48 pt-4 pr-4">
      <div className="space-y-1 bg-white p-3 rounded-sm shadow-sm border border-gray-200 skeumorphic-card">
        <SidebarItem icon={<Home className="h-5 w-5" />} label="Home" active />
        <SidebarItem icon={<User className="h-5 w-5" />} label="Profile" />
        <SidebarItem icon={<Users className="h-5 w-5" />} label="Explore" />
        <SidebarItem icon={<Calendar className="h-5 w-5" />} label="Events" />
        <SidebarItem icon={<Image className="h-5 w-5" />} label="Photos" />
        <SidebarItem icon={<Users className="h-5 w-5" />} label="Circles" />
        <SidebarItem icon={<Map className="h-5 w-5" />} label="Local" />
        <SidebarItem icon={<Menu className="h-5 w-5" />} label="Games" />
        <div className="py-2">
          <div className="w-full border-t border-gray-200"></div>
        </div>
        <SidebarItem icon={<span className="flex h-5 w-5 items-center justify-center">•••</span>} label="More" />
      </div>
    </div>
  );
};

export default Sidebar;
