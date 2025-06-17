
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { apiService } from '@/services/api';
import { Temple } from '@/types/api';

interface TempleFormProps {
  temple?: Temple;
  onSuccess: () => void;
  onCancel: () => void;
}

interface TempleFormData {
  name: string;
  address: string;
  phoneNumber?: string;
  description?: string;
  contactNumber?: string;
  email?: string;
  breakfastSlots: number;
  lunchSlots: number;
  familiesPerMeal: number;
}

export function TempleForm({ temple, onSuccess, onCancel }: TempleFormProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<TempleFormData>({
    defaultValues: {
      name: temple?.name || '',
      address: temple?.address || '',
      phoneNumber: temple?.phoneNumber || '',
      description: temple?.description || '',
      contactNumber: temple?.contactNumber || '',
      email: temple?.email || '',
      breakfastSlots: temple?.breakfastSlots || 5,
      lunchSlots: temple?.lunchSlots || 5,
      familiesPerMeal: temple?.familiesPerMeal || 3,
    },
  });

  const onSubmit = async (data: TempleFormData) => {
    setLoading(true);
    try {
      if (temple?.id) {
        await apiService.updateTemple(temple.id, data);
        toast({
          title: "Success",
          description: "Temple updated successfully",
        });
      } else {
        await apiService.createTemple(data);
        toast({
          title: "Success",
          description: "Temple created successfully",
        });
      }
      onSuccess();
    } catch (error) {
      console.error('Temple form error:', error);
      toast({
        title: "Error",
        description: "Failed to save temple",
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
          {temple ? 'Edit Temple' : 'Create New Temple'}
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
                  <FormLabel>Temple Name</FormLabel>
                  <FormControl>
                    <Input {...field} required />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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

            <div className="grid grid-cols-2 gap-4">
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

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} type="email" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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

            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="breakfastSlots"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Breakfast Slots</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" min="1" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lunchSlots"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lunch Slots</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" min="1" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="familiesPerMeal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Families Per Meal</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" min="1" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
                {loading ? 'Saving...' : temple ? 'Update Temple' : 'Create Temple'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
