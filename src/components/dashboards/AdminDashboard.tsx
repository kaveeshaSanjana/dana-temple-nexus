import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Dashboard } from "@/components/Dashboard";
import { TempleManagement } from "@/components/TempleManagement";
import { VillageManagement } from "@/components/VillageManagement";
import { FamilyManagement } from "@/components/FamilyManagement";
import { DanaManagement } from "@/components/DanaManagement";
import { AssignmentManagement } from "@/components/AssignmentManagement";
import { HeadMonkManagement } from "@/components/HeadMonkManagement";
import { HelperManagement } from "@/components/HelperManagement";
import { MemberManagement } from "@/components/MemberManagement";
import { Profile } from "@/components/Profile";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

export const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard />;
      case "temples":
        return <TempleManagement />;
      case "villages":
        return <VillageManagement />;
      case "families":
        return <FamilyManagement />;
      case "dana":
        return <DanaManagement />;
      case "assignments":
        return <AssignmentManagement />;
      case "headmonks":
        return <HeadMonkManagement />;
      case "helpers":
        return <HelperManagement />;
      case "members":
        return <MemberManagement />;
      case "profile":
        return <Profile />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 flex">
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden fixed top-4 left-4 z-50 bg-white shadow-lg"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      {/* Sidebar */}
      <div className={`
        fixed md:relative inset-y-0 left-0 z-40 transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} userRole="admin" />
      </div>

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Main content */}
      <main className="flex-1 p-4 md:p-6 overflow-auto ml-0 md:ml-0">
        <div className="pt-16 md:pt-0">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};
