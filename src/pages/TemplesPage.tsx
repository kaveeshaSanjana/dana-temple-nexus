
import React, { useEffect, useState } from 'react';
import { DataTable } from '@/components/ui/data-table';
import { apiService } from '@/services/api';
import { Temple } from '@/types/api';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

const columns = [
  { key: 'name' as keyof Temple, header: 'Temple Name' },
  { key: 'address' as keyof Temple, header: 'Address' },
  { key: 'phoneNumber' as keyof Temple, header: 'Phone' },
  { key: 'headMonkName' as keyof Temple, header: 'Head Monk' },
  { 
    key: 'active' as keyof Temple, 
    header: 'Status',
    render: (active: boolean) => (
      <Badge className={active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
        {active ? 'Active' : 'Inactive'}
      </Badge>
    )
  },
];

export function TemplesPage() {
  const [temples, setTemples] = useState<Temple[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadTemples();
  }, []);

  const loadTemples = async () => {
    try {
      const data = await apiService.getTemples();
      setTemples(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load temples",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    // TODO: Implement temple creation modal
    toast({
      title: "Coming Soon",
      description: "Temple creation functionality will be implemented",
    });
  };

  const handleEdit = (temple: Temple) => {
    // TODO: Implement temple edit modal
    toast({
      title: "Coming Soon",
      description: `Edit temple: ${temple.name}`,
    });
  };

  const handleDelete = (temple: Temple) => {
    // TODO: Implement temple deletion with confirmation
    toast({
      title: "Coming Soon",
      description: `Delete temple: ${temple.name}`,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-blue-900">Temples Management</h1>
        <p className="text-blue-600 mt-2">Manage all temples in the system</p>
      </div>

      <DataTable
        data={temples}
        columns={columns}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        addButtonText="Add Temple"
        searchPlaceholder="Search temples..."
        loading={loading}
      />
    </div>
  );
}
