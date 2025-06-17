
import React, { useEffect, useState } from 'react';
import { DataTable } from '@/components/ui/data-table';
import { apiService } from '@/services/api';
import { Village } from '@/types/api';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

const columns = [
  { key: 'name' as keyof Village, header: 'Village Name' },
  { key: 'description' as keyof Village, header: 'Description' },
  { 
    key: 'families' as keyof Village, 
    header: 'Families',
    render: (families: any[]) => families?.length || 0
  },
  { 
    key: 'active' as keyof Village, 
    header: 'Status',
    render: (active: boolean) => (
      <Badge className={active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
        {active ? 'Active' : 'Inactive'}
      </Badge>
    )
  },
];

export function VillagesPage() {
  const [villages, setVillages] = useState<Village[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadVillages();
  }, []);

  const loadVillages = async () => {
    try {
      const data = await apiService.getVillages();
      setVillages(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load villages",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-blue-900">Villages Management</h1>
        <p className="text-blue-600 mt-2">Manage village records and assignments</p>
      </div>

      <DataTable
        data={villages}
        columns={columns}
        searchPlaceholder="Search villages..."
        loading={loading}
      />
    </div>
  );
}
