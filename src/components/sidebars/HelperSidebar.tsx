import { Calendar, BarChart3, LogOut, Users, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

interface HelperSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const HelperSidebar = ({ activeTab, setActiveTab }: HelperSidebarProps) => {
  const navigate = useNavigate();

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "assignments", label: "Dana Assignments", icon: Calendar },
    { id: "members", label: "Member Management", icon: Users },
    { id: "profile", label: "Profile", icon: User },
  ];

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="w-64 h-screen bg-white shadow-lg border-r border-orange-200 flex flex-col">
      <div className="p-6 border-b border-orange-200 flex-shrink-0">
        <h1 className="text-2xl font-bold text-orange-800">Dana Manager</h1>
        <p className="text-sm text-orange-600 mt-1">Helper Portal</p>
      </div>
      
      <nav className="flex-1 flex flex-col justify-between">
        <div className="mt-6 flex-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  "w-full flex items-center px-6 py-3 text-left transition-colors",
                  "hover:bg-orange-50 hover:text-orange-700",
                  activeTab === item.id
                    ? "bg-orange-100 text-orange-800 border-r-2 border-orange-500"
                    : "text-gray-600"
                )}
              >
                <Icon className="h-5 w-5 mr-3" />
                {item.label}
              </button>
            );
          })}
        </div>
        
        <div className="p-4 border-t border-orange-100">
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-2 py-3 text-left transition-colors hover:bg-red-50 hover:text-red-700 text-gray-600 rounded-lg"
          >
            <LogOut className="h-5 w-5 mr-3" />
            Logout
          </button>
        </div>
      </nav>
    </div>
  );
};
