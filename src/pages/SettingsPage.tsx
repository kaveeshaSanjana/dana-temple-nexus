
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';

export function SettingsPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-blue-900">Settings</h1>
        <p className="text-blue-600 mt-2">Manage your account and system preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-900">Profile Information</CardTitle>
            <CardDescription>Your account details and role information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Full Name</label>
              <p className="text-lg">{user?.fullName}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Email</label>
              <p className="text-lg">{user?.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Phone</label>
              <p className="text-lg">{user?.phoneNumber || 'Not provided'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Role</label>
              <p className="text-lg">{user?.role?.replace('_', ' ')}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-900">System Settings</CardTitle>
            <CardDescription>Configure your system preferences</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-center text-gray-500 py-8">
              Settings configuration will be implemented here.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
