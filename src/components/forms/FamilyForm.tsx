
import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Plus, X } from 'lucide-react';
import { apiService } from '@/services/api';
import { Family, Village } from '@/types/api';

interface FamilyFormProps {
  family?: Family;
  onSuccess: () => void;
  onCancel: () => void;
}

interface FamilyFormData {
  name: string;
  address: string;
  phoneNumber?: string;
  villageId?: number;
  members: {
    id?: number;
    name: string;
    dateOfBirth: string;
    phoneNumber?: string;
  }[];
}

export function FamilyForm({ family, onSuccess, onCancel }: FamilyFormProps) {
  const [loading, setLoading] = useState(false);
  const [villages, setVillages] = useState<Village[]>([]);
  const { toast } = useToast();
  
  const form = useForm<FamilyFormData>({
    defaultValues: {
      name: family?.name || '',
      address: family?.address || '',
      phoneNumber: family?.phoneNumber || '',
      villageId: family?.villageId || undefined,
      members: family?.members || [{ name: '', dateOfBirth: '', phoneNumber: '' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'members',
  });

  useEffect(() => {
    const fetchVillages = async () => {
      try {
        const villageData = await apiService.getVillages();
        setVillages(villageData);
      } catch (error) {
        console.error('Failed to fetch villages:', error);
      }
    };
    fetchVillages();
  }, []);

  const onSubmit = async (data: FamilyFormData) => {
    setLoading(true);
    try {
      // Transform the data to match the API expectations
      const apiData = {
        name: data.name,
        address: data.address,
        phoneNumber: data.phoneNumber,
        villageId: data.villageId,
        members: data.members.map((member, index) => ({
          id: member.id || 0, // Use existing ID or 0 for new members
          name: member.name,
          dateOfBirth: member.dateOfBirth,
          phoneNumber: member.phoneNumber,
        }))
      };

      if (family?.id) {
        await apiService.updateFamily(family.id, apiData);
        toast({
          title: "Success",
          description: "Family updated successfully",
        });
      } else {
        await apiService.createFamily(apiData);
        toast({
          title: "Success",
          description: "Family created successfully",
        });
      }
      onSuccess();
    } catch (error) {
      console.error('Family form error:', error);
      toast({
        title: "Error",
        description: "Failed to save family",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-blue-900">
          {family ? 'Edit Family' : 'Create New Family'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Family Name</FormLabel>
                    <FormControl>
                      <Input {...field} required />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Textarea {...field} required />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="villageId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Village</FormLabel>
                  <FormControl>
                    <select 
                      {...field} 
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={field.value || ''}
                      onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                    >
                      <option value="">Select Village</option>
                      {villages.map((village) => (
                        <option key={village.id} value={village.id}>
                          {village.name}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-blue-900">Family Members</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => append({ name: '', dateOfBirth: '', phoneNumber: '' })}
                  className="border-blue-300"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Member
                </Button>
              </div>

              {fields.map((field, index) => (
                <Card key={field.id} className="p-4 border-blue-200">
                  <div className="grid grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name={`members.${index}.name`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input {...field} required />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`members.${index}.dateOfBirth`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date of Birth</FormLabel>
                          <FormControl>
                            <Input {...field} type="date" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`members.${index}.phoneNumber`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <div className="flex space-x-2">
                              <Input {...field} />
                              {fields.length > 1 && (
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => remove(index)}
                                  className="text-red-600 border-red-300"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </Card>
              ))}
            </div>

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
                {loading ? 'Saving...' : family ? 'Update Family' : 'Create Family'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
