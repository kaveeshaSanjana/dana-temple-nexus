
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { apiService } from '@/services/api';
import { Temple, Family, TimeSlot } from '@/types/api';

interface DanaAssignmentFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

interface DanaAssignmentFormData {
  templeId: number;
  familyIds: number[];
  date: string;
  timeSlot: TimeSlot;
  notes?: string;
}

export function DanaAssignmentForm({ onSuccess, onCancel }: DanaAssignmentFormProps) {
  const [loading, setLoading] = useState(false);
  const [temples, setTemples] = useState<Temple[]>([]);
  const [families, setFamilies] = useState<Family[]>([]);
  const [selectedTemple, setSelectedTemple] = useState<number | null>(null);
  const { toast } = useToast();
  
  const form = useForm<DanaAssignmentFormData>({
    defaultValues: {
      templeId: 0,
      familyIds: [],
      date: '',
      timeSlot: 'BREAKFAST',
      notes: '',
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

  useEffect(() => {
    if (selectedTemple) {
      const fetchFamilies = async () => {
        try {
          const familyData = await apiService.getFamiliesByTemple(selectedTemple);
          setFamilies(familyData);
        } catch (error) {
          console.error('Failed to fetch families:', error);
        }
      };
      fetchFamilies();
    }
  }, [selectedTemple]);

  const handleTempleChange = (templeId: number) => {
    setSelectedTemple(templeId);
    form.setValue('templeId', templeId);
    form.setValue('familyIds', []);
  };

  const handleFamilyToggle = (familyId: number, checked: boolean) => {
    const currentFamilyIds = form.getValues('familyIds');
    if (checked) {
      form.setValue('familyIds', [...currentFamilyIds, familyId]);
    } else {
      form.setValue('familyIds', currentFamilyIds.filter(id => id !== familyId));
    }
  };

  const onSubmit = async (data: DanaAssignmentFormData) => {
    if (data.familyIds.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one family",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      await apiService.createDanaAssignment(data);
      toast({
        title: "Success",
        description: "Dana assignment created successfully",
      });
      onSuccess();
    } catch (error) {
      console.error('Dana assignment form error:', error);
      toast({
        title: "Error",
        description: "Failed to create dana assignment",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="text-blue-900">Create Dana Assignment</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="templeId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Temple</FormLabel>
                    <FormControl>
                      <select 
                        {...field} 
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        value={field.value || ''}
                        onChange={(e) => {
                          const value = Number(e.target.value);
                          field.onChange(value);
                          handleTempleChange(value);
                        }}
                        required
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

              <FormField
                control={form.control}
                name="timeSlot"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time Slot</FormLabel>
                    <FormControl>
                      <select 
                        {...field} 
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        required
                      >
                        <option value="BREAKFAST">Breakfast</option>
                        <option value="LUNCH">Lunch</option>
                        <option value="DINNER">Dinner</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date</FormLabel>
                  <FormControl>
                    <Input {...field} type="date" required />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {selectedTemple && families.length > 0 && (
              <div className="space-y-4">
                <FormLabel>Select Families</FormLabel>
                <div className="grid grid-cols-2 gap-4 max-h-60 overflow-y-auto border rounded-md p-4">
                  {families.map((family) => (
                    <div key={family.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`family-${family.id}`}
                        onCheckedChange={(checked) => 
                          handleFamilyToggle(family.id, checked as boolean)
                        }
                      />
                      <label
                        htmlFor={`family-${family.id}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {family.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
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
                {loading ? 'Creating...' : 'Create Assignment'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
