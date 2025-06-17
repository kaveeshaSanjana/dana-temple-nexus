
import React, { useEffect, useState } from 'react';
import { DataTable } from '@/components/ui/data-table';
import { apiService } from '@/services/api';
import { Family } from '@/types/api';
import { useToast } from '@/hooks/use-toast';

const columns = [
  { key: 'name' as keyof Family, header: 'Family Name' },
  { key: 'address' as keyof Family, header: 'Address' },
  { key: 'phoneNumber' as keyof Family, header: 'Phone' },
  { key: 'villageName' as keyof Family, header: 'Village' },
  { key: 'templeName' as keyof Family, header: 'Temple' },
  { 
    key: 'members' as keyof Family, 
    header: 'Members',
    render: (members: any[]) => members?.length || 0
  },
];

export function FamiliesPage() {
  const [families, setFamilies] = useState<Family[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadFamilies();
  }, []);

  const loadFamilies = async () => {
    try {
      const data = await apiService.getFamilies();
      setFamilies(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load families",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    toast({
      title: "Coming Soon",
      description: "Family creation functionality will be implemented",
    });
  };

  const handleEdit = (family: Family) => {
    toast({
      title: "Coming Soon",
      description: `Edit family: ${family.name}`,
    });
  };

  const handleDelete = (family: Family) => {
    toast({
      title: "Coming Soon",
      description: `Delete family: ${family.name}`,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-blue-900">Families Management</h1>
        <p className="text-blue-600 mt-2">Manage family records and members</p>
      </div>

      <DataTable
        data={families}
        columns={columns}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        addButtonText="Add Family"
        searchPlaceholder="Search families..."
        loading={loading}
      />
    </div>
  );
}
