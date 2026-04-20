import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, User, Users, Image, Calendar, Map, Menu } from 'lucide-react';

interface SidebarItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ to, icon, label }) => (
  <NavLink
    to={to}
    end
    className={({ isActive }) => `material-list-item ${isActive ? 'active' : ''}`}
  >
    <div className="mr-3">{icon}</div>
    <span className="text-sm">{label}</span>
  </NavLink>
);

const Sidebar = () => {
  return (
    <div className="hidden md:block w-48 pt-4 pr-4">
      <div className="material-card p-2 rounded-sm">
        <SidebarItem to="/" icon={<Home className="h-5 w-5" />} label="Home" />
        <SidebarItem to="/profile" icon={<User className="h-5 w-5" />} label="Profile" />
        <SidebarItem to="/groups" icon={<Users className="h-5 w-5" />} label="Groups" />
        <div className="material-list-item opacity-50 cursor-not-allowed"><div className="mr-3"><Calendar className="h-5 w-5" /></div><span className="text-sm">Events</span></div>
        <div className="material-list-item opacity-50 cursor-not-allowed"><div className="mr-3"><Image className="h-5 w-5" /></div><span className="text-sm">Photos</span></div>
        <div className="material-list-item opacity-50 cursor-not-allowed"><div className="mr-3"><Map className="h-5 w-5" /></div><span className="text-sm">Local</span></div>
        <div className="material-list-item opacity-50 cursor-not-allowed"><div className="mr-3"><Menu className="h-5 w-5" /></div><span className="text-sm">Games</span></div>
      </div>
    </div>
  );
};

export default Sidebar;
