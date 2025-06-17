
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DanaCard } from '@/components/dana/DanaCard';
import { apiService } from '@/services/api';
import { DanaAssignment, SystemStats } from '@/types/api';
import { Building, Users, Calendar, CheckCircle } from 'lucide-react';

export function Dashboard() {
  const { user } = useAuth();
  const [recentAssignments, setRecentAssignments] = useState<DanaAssignment[]>([]);
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        if (user?.role === 'SUPER_ADMIN') {
          const systemStats = await apiService.getSystemStats();
          setStats(systemStats);
        }

        // Load recent assignments based on user role
        if (user?.role === 'MEMBER') {
          // For members, show their family's assignments
          // This would require additional API endpoint or family ID
          setRecentAssignments([]);
        } else {
          // For admins and helpers, show recent assignments
          setRecentAssignments([]);
        }
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [user]);

  const renderWelcomeMessage = () => {
    const roleMessages = {
      SUPER_ADMIN: 'You have full system access. Monitor temples, users, and system health.',
      HEAD_MONK: 'Manage your temple, families, and dana schedules.',
      HELPER: 'Assist with family management and dana coordination.',
      MEMBER: 'View your family\'s dana assignments and schedules.',
    };

    return roleMessages[user?.role as keyof typeof roleMessages] || 'Welcome to the Dana Management System';
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg border border-blue-200">
          <div className="animate-pulse">
            <div className="h-8 bg-blue-100 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 rounded-lg">
        <h1 className="text-3xl font-bold mb-2">Welcome, {user?.fullName}!</h1>
        <p className="text-blue-100">{renderWelcomeMessage()}</p>
      </div>

      {/* Stats Cards - Only for System Admin */}
      {user?.role === 'SUPER_ADMIN' && stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-blue-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-900">Total Temples</CardTitle>
              <Building className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-800">{stats.totalTemples}</div>
            </CardContent>
          </Card>

          <Card className="border-blue-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-900">Total Families</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-800">{stats.totalFamilies}</div>
            </CardContent>
          </Card>

          <Card className="border-blue-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-900">Total Dana</CardTitle>
              <Calendar className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-800">{stats.totalDanas}</div>
            </CardContent>
          </Card>

          <Card className="border-blue-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-900">Active Dana</CardTitle>
              <CheckCircle className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-800">{stats.activeDanas}</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Quick Actions */}
      <Card className="border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900">Quick Actions</CardTitle>
          <CardDescription>Common tasks based on your role</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {user?.role === 'SUPER_ADMIN' && (
              <>
                <button className="p-4 bg-blue-50 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors text-left">
                  <h3 className="font-semibold text-blue-900">Manage Temples</h3>
                  <p className="text-sm text-blue-600 mt-1">Create and manage temple settings</p>
                </button>
                <button className="p-4 bg-blue-50 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors text-left">
                  <h3 className="font-semibold text-blue-900">User Management</h3>
                  <p className="text-sm text-blue-600 mt-1">Manage user roles and permissions</p>
                </button>
                <button className="p-4 bg-blue-50 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors text-left">
                  <h3 className="font-semibold text-blue-900">System Reports</h3>
                  <p className="text-sm text-blue-600 mt-1">View system statistics and reports</p>
                </button>
              </>
            )}
            
            {user?.role === 'HEAD_MONK' && (
              <>
                <button className="p-4 bg-blue-50 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors text-left">
                  <h3 className="font-semibold text-blue-900">Manage Families</h3>
                  <p className="text-sm text-blue-600 mt-1">Add and manage temple families</p>
                </button>
                <button className="p-4 bg-blue-50 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors text-left">
                  <h3 className="font-semibold text-blue-900">Dana Schedule</h3>
                  <p className="text-sm text-blue-600 mt-1">Create and manage dana assignments</p>
                </button>
                <button className="p-4 bg-blue-50 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors text-left">
                  <h3 className="font-semibold text-blue-900">Reports</h3>
                  <p className="text-sm text-blue-600 mt-1">View temple reports and statistics</p>
                </button>
              </>
            )}

            {user?.role === 'HELPER' && (
              <>
                <button className="p-4 bg-blue-50 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors text-left">
                  <h3 className="font-semibold text-blue-900">Family Records</h3>
                  <p className="text-sm text-blue-600 mt-1">Update family information</p>
                </button>
                <button className="p-4 bg-blue-50 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors text-left">
                  <h3 className="font-semibold text-blue-900">Schedule Dana</h3>
                  <p className="text-sm text-blue-600 mt-1">Assist with dana scheduling</p>
                </button>
              </>
            )}

            {user?.role === 'MEMBER' && (
              <>
                <button className="p-4 bg-blue-50 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors text-left">
                  <h3 className="font-semibold text-blue-900">My Dana Schedule</h3>
                  <p className="text-sm text-blue-600 mt-1">View your family's dana assignments</p>
                </button>
                <button className="p-4 bg-blue-50 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors text-left">
                  <h3 className="font-semibold text-blue-900">Confirm Dana</h3>
                  <p className="text-sm text-blue-600 mt-1">Confirm upcoming dana assignments</p>
                </button>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Recent Dana Assignments */}
      {recentAssignments.length > 0 && (
        <Card className="border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-900">Recent Dana Assignments</CardTitle>
            <CardDescription>Your recent dana schedules and assignments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {recentAssignments.slice(0, 4).map((assignment) => (
                <DanaCard
                  key={assignment.id}
                  assignment={assignment}
                  showActions={user?.role === 'MEMBER'}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
