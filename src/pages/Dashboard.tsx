
import { useState, useEffect } from "react";
import { AdminDashboard } from "@/components/dashboards/AdminDashboard";
import { HeadMonkDashboard } from "@/components/dashboards/HeadMonkDashboard";
import { HelperDashboard } from "@/components/dashboards/HelperDashboard";
import { MemberDashboard } from "@/components/dashboards/MemberDashboard";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [userRole, setUserRole] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    const role = localStorage.getItem("userRole");
    
    if (!isLoggedIn || !role) {
      navigate("/");
      return;
    }
    
    setUserRole(role);
  }, [navigate]);

  const renderDashboard = () => {
    switch (userRole) {
      case "admin":
        return <AdminDashboard />;
      case "headmonk":
        return <HeadMonkDashboard />;
      case "helper":
        return <HelperDashboard />;
      case "member":
        return <MemberDashboard />;
      default:
        return <div>Loading...</div>;
    }
  };

  return renderDashboard();
};

export default Dashboard;
