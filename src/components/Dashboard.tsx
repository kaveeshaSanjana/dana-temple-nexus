
import { Building, Home, Users, Heart, Calendar, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Dashboard = () => {
  const stats = [
    {
      title: "Active Temples",
      value: "12",
      icon: Building,
      trend: "+2 this month",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Registered Villages",
      value: "45",
      icon: Home,
      trend: "+5 this month",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Participating Families",
      value: "328",
      icon: Users,
      trend: "+18 this month",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Dana Types",
      value: "8",
      icon: Heart,
      trend: "No change",
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
    {
      title: "Monthly Assignments",
      value: "156",
      icon: Calendar,
      trend: "+23 this month",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      title: "Completion Rate",
      value: "94%",
      icon: TrendingUp,
      trend: "+3% from last month",
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Dashboard</h2>
          <p className="text-gray-600 mt-1">Overview of your temple management system</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <p className="text-xs text-gray-500 mt-1">{stat.trend}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">New family registered</p>
                  <p className="text-xs text-gray-500">Silva Family - Colombo Village</p>
                </div>
                <span className="text-xs text-gray-400">2 hours ago</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Dana assignment confirmed</p>
                  <p className="text-xs text-gray-500">Morning Dana - Temple of Peace</p>
                </div>
                <span className="text-xs text-gray-400">4 hours ago</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">New temple added</p>
                  <p className="text-xs text-gray-500">Sri Dharma Temple</p>
                </div>
                <span className="text-xs text-gray-400">1 day ago</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Dana Assignments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                <div>
                  <p className="font-medium text-orange-800">Morning Dana</p>
                  <p className="text-sm text-orange-600">Perera Family</p>
                </div>
                <span className="text-sm font-medium text-orange-700">Tomorrow</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div>
                  <p className="font-medium text-blue-800">Evening Dana</p>
                  <p className="text-sm text-blue-600">Fernando Family</p>
                </div>
                <span className="text-sm font-medium text-blue-700">Dec 24</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div>
                  <p className="font-medium text-green-800">Special Dana</p>
                  <p className="text-sm text-green-600">Wijesinghe Family</p>
                </div>
                <span className="text-sm font-medium text-green-700">Dec 25</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
