
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { apiService } from '@/services/api';
import { User, UserRole } from '@/types/auth';

interface UserFormProps {
  user?: User;
  onSuccess: () => void;
  onCancel: () => void;
}

interface UserFormData {
  email: string;
  password?: string;
  fullName: string;
  phoneNumber?: string;
  role: UserRole;
}

export function UserForm({ user, onSuccess, onCancel }: UserFormProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<UserFormData>({
    defaultValues: {
      email: user?.email || '',
      password: '',
      fullName: user?.fullName || '',
      phoneNumber: user?.phoneNumber || '',
      role: user?.role || 'MEMBER',
    },
  });

  const onSubmit = async (data: UserFormData) => {
    setLoading(true);
    try {
      if (user?.id) {
        // Update user (password is optional)
        const updateData = { ...data };
        if (!updateData.password) {
          delete updateData.password;
        }
        await apiService.request(`/admin/users/${user.id}`, {
          method: 'PUT',
          body: JSON.stringify(updateData),
        });
        toast({
          title: "Success",
          description: "User updated successfully",
        });
      } else {
        // Create new user (password is required)
        if (!data.password) {
          toast({
            title: "Error",
            description: "Password is required for new users",
            variant: "destructive",
          });
          return;
        }
        await apiService.request('/users', {
          method: 'POST',
          body: JSON.stringify(data),
        });
        toast({
          title: "Success",
          description: "User created successfully",
        });
      }
      onSuccess();
    } catch (error) {
      console.error('User form error:', error);
      toast({
        title: "Error",
        description: "Failed to save user",
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
          {user ? 'Edit User' : 'Create New User'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input {...field} required />
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
                      <Input {...field} type="email" required />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <FormControl>
                      <select 
                        {...field} 
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        required
                      >
                        <option value="MEMBER">Member</option>
                        <option value="HELPER">Helper</option>
                        <option value="HEAD_MONK">Head Monk</option>
                        <option value="SUPER_ADMIN">Super Admin</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Password {user ? '(leave blank to keep current)' : '(required)'}
                  </FormLabel>
                  <FormControl>
                    <Input {...field} type="password" required={!user} />
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
                {loading ? 'Saving...' : user ? 'Update User' : 'Create User'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
