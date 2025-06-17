
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { apiService } from '@/services/api';
import { Village, Temple } from '@/types/api';

interface VillageFormProps {
  village?: Village;
  onSuccess: () => void;
  onCancel: () => void;
}

interface VillageFormData {
  name: string;
  description?: string;
  templeId?: number;
}

export function VillageForm({ village, onSuccess, onCancel }: VillageFormProps) {
  const [loading, setLoading] = useState(false);
  const [temples, setTemples] = useState<Temple[]>([]);
  const { toast } = useToast();
  
  const form = useForm<VillageFormData>({
    defaultValues: {
      name: village?.name || '',
      description: village?.description || '',
      templeId: village?.temple?.id || undefined,
    },
  });

  useEffect(() => {
    const fetchTemples = async () => {
      try {
        const templeData = await apiService.getTemples();
        setTemples(templeData);
      } catch (error) {
        console.error('Failed to fetch temples:', error);
      }
    };
    fetchTemples();
  }, []);

  const onSubmit = async (data: VillageFormData) => {
    setLoading(true);
    try {
      if (village?.id) {
        await apiService.updateVillage(village.id, data);
        toast({
          title: "Success",
          description: "Village updated successfully",
        });
      } else {
        await apiService.createVillage(data);
        toast({
          title: "Success",
          description: "Village created successfully",
        });
      }
      onSuccess();
    } catch (error) {
      console.error('Village form error:', error);
      toast({
        title: "Error",
        description: "Failed to save village",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-blue-900">
          {village ? 'Edit Village' : 'Create New Village'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Village Name</FormLabel>
                  <FormControl>
                    <Input {...field} required />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="templeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Assigned Temple</FormLabel>
                  <FormControl>
                    <select 
                      {...field} 
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={field.value || ''}
                      onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                    >
                      <option value="">Select Temple</option>
                      {temples.map((temple) => (
                        <option key={temple.id} value={temple.id}>
                          {temple.name}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700">
                {loading ? 'Saving...' : village ? 'Update Village' : 'Create Village'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
