
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { helperService, HelperDTO } from "@/services/helperService";
import { useToast } from "@/hooks/use-toast";

interface AddEditHelperDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  helper?: HelperDTO;
  mode: 'add' | 'edit';
}

export const AddEditHelperDialog = ({ 
  open, 
  onOpenChange, 
  onSuccess, 
  helper, 
  mode 
}: AddEditHelperDialogProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    templeId: 1, // Default temple ID
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (mode === 'edit' && helper) {
      setFormData({
        name: helper.name,
        email: helper.email,
        phoneNumber: helper.phoneNumber,
        templeId: helper.templeId,
      });
    } else if (mode === 'add') {
      setFormData({
        name: '',
        email: '',
        phoneNumber: '',
        templeId: 1,
      });
    }
  }, [mode, helper, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.phoneNumber) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      if (mode === 'add') {
        await helperService.createHelper(formData);
        toast({
          title: "Success",
          description: "Helper created successfully",
        });
      } else if (mode === 'edit' && helper) {
        // For update, exclude phoneNumber and templeId as per requirements
        const updateData = {
          name: formData.name,
          email: formData.email,
        };
        await helperService.updateHelper(helper.id!, updateData);
        toast({
          title: "Success",
          description: "Helper updated successfully",
        });
      }
      
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${mode} helper`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{mode === 'add' ? 'Add New Helper' : 'Edit Helper'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter helper name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="Enter email address"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Phone Number *</Label>
            <Input
              id="phoneNumber"
              value={formData.phoneNumber}
              onChange={(e) => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
              placeholder="Enter phone number"
              required
              disabled={mode === 'edit'}
            />
            {mode === 'edit' && (
              <p className="text-xs text-gray-500">Phone number cannot be changed</p>
            )}
          </div>

          {mode === 'add' && (
            <div className="space-y-2">
              <Label htmlFor="templeId">Temple ID *</Label>
              <Input
                id="templeId"
                type="number"
                value={formData.templeId}
                onChange={(e) => setFormData(prev => ({ ...prev, templeId: parseInt(e.target.value) }))}
                placeholder="Enter temple ID"
                required
              />
            </div>
          )}

          {mode === 'edit' && (
            <div className="space-y-2">
              <Label>Temple ID</Label>
              <Input
                value={formData.templeId}
                disabled
                className="bg-gray-100"
              />
              <p className="text-xs text-gray-500">Temple ID cannot be changed</p>
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? `${mode === 'add' ? 'Adding' : 'Updating'}...` : `${mode === 'add' ? 'Add' : 'Update'} Helper`}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
