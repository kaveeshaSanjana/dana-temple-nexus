
import React, { useEffect, useState } from 'react';
import { DataTable } from '@/components/ui/data-table';
import { apiService } from '@/services/api';
import { User } from '@/types/auth';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

const columns = [
  { key: 'fullName' as keyof User, header: 'Full Name' },
  { key: 'email' as keyof User, header: 'Email' },
  { key: 'phoneNumber' as keyof User, header: 'Phone' },
  { 
    key: 'role' as keyof User, 
    header: 'Role',
    render: (role: string) => (
      <Badge className="bg-blue-100 text-blue-800">
        {role.replace('_', ' ')}
      </Badge>
    )
  },
  { 
    key: 'enabled' as keyof User, 
    header: 'Status',
    render: (enabled: boolean) => (
      <Badge className={enabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
        {enabled ? 'Active' : 'Disabled'}
      </Badge>
    )
  },
];

export function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await apiService.getAllUsers();
      setUsers(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load users",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-blue-900">User Management</h1>
        <p className="text-blue-600 mt-2">Manage system users and their permissions</p>
      </div>

      <DataTable
        data={users}
        columns={columns}
        searchPlaceholder="Search users..."
        loading={loading}
      />
    </div>
  );
}
