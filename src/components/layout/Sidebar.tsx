
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  Users, 
  Building, 
  Calendar, 
  Settings, 
  LogOut,
  Shield,
  UserCog,
  MapPin,
  BarChart3
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarItem {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
  roles: string[];
}

const sidebarItems: SidebarItem[] = [
  { name: 'Dashboard', icon: Home, path: '/dashboard', roles: ['SUPER_ADMIN', 'HEAD_MONK', 'HELPER', 'MEMBER'] },
  { name: 'Temples', icon: Building, path: '/temples', roles: ['SUPER_ADMIN', 'HEAD_MONK'] },
  { name: 'Families', icon: Users, path: '/families', roles: ['SUPER_ADMIN', 'HEAD_MONK', 'HELPER'] },
  { name: 'Villages', icon: MapPin, path: '/villages', roles: ['SUPER_ADMIN', 'HEAD_MONK'] },
  { name: 'Dana Schedule', icon: Calendar, path: '/dana', roles: ['SUPER_ADMIN', 'HEAD_MONK', 'HELPER', 'MEMBER'] },
  { name: 'Users', icon: UserCog, path: '/users', roles: ['SUPER_ADMIN'] },
  { name: 'System Stats', icon: BarChart3, path: '/stats', roles: ['SUPER_ADMIN'] },
  { name: 'Settings', icon: Settings, path: '/settings', roles: ['SUPER_ADMIN', 'HEAD_MONK', 'HELPER', 'MEMBER'] },
];

interface SidebarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export function Sidebar({ currentPath, onNavigate }: SidebarProps) {
  const { user, logout } = useAuth();

  const filteredItems = sidebarItems.filter(item => 
    user?.role && item.roles.includes(user.role)
  );

  return (
    <div className="w-64 h-screen bg-blue-900 text-white flex flex-col">
      <div className="p-6 border-b border-blue-800">
        <h1 className="text-xl font-bold">Dana Management</h1>
        <p className="text-blue-200 text-sm mt-1">{user?.fullName}</p>
        <p className="text-blue-300 text-xs">{user?.role?.replace('_', ' ')}</p>
      </div>
      
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {filteredItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.path}>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start text-left hover:bg-blue-800",
                    currentPath === item.path && "bg-blue-800 text-white"
                  )}
                  onClick={() => onNavigate(item.path)}
                >
                  <Icon className="mr-3 h-4 w-4" />
                  {item.name}
                </Button>
              </li>
            );
          })}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-blue-800">
        <Button
          variant="ghost"
          className="w-full justify-start text-left hover:bg-blue-800"
          onClick={logout}
        >
          <LogOut className="mr-3 h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );
}
