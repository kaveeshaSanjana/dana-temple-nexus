
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { DanaCard } from '@/components/dana/DanaCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DanaAssignment } from '@/types/api';

export function DanaPage() {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState<DanaAssignment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data for now
    setLoading(false);
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-blue-900">Dana Schedule</h1>
        <p className="text-blue-600 mt-2">
          {user?.role === 'MEMBER' 
            ? 'Your family\'s dana assignments and schedules'
            : 'Manage dana assignments and schedules'
          }
        </p>
      </div>

      {user?.role === 'MEMBER' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {assignments.length === 0 ? (
            <Card className="col-span-full border-blue-200">
              <CardContent className="p-8 text-center">
                <p className="text-gray-500">No dana assignments found for your family.</p>
              </CardContent>
            </Card>
          ) : (
            assignments.map((assignment) => (
              <DanaCard
                key={assignment.id}
                assignment={assignment}
                showActions={true}
              />
            ))
          )}
        </div>
      ) : (
        <Card className="border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-900">Dana Management</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-gray-500 py-8">
              Dana management interface will be implemented here.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
