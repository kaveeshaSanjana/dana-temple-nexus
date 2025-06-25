
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { VillageDTO, VillageService } from "@/services/villageService";

interface CreateVillageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onVillageCreated: (village: VillageDTO) => void;
}

export const CreateVillageDialog = ({ open, onOpenChange, onVillageCreated }: CreateVillageDialogProps) => {
  const [villageData, setVillageData] = useState<VillageDTO>({
    name: '',
    province: '',
    district: '',
    country: 'Sri Lanka',
    postalCode: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const newVillage = await VillageService.createVillage(villageData);
      onVillageCreated(newVillage);
      onOpenChange(false);
      setVillageData({
        name: '',
        province: '',
        district: '',
        country: 'Sri Lanka',
        postalCode: ''
      });
    } catch (error) {
      console.error('Failed to create village:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Village</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Village Name *</Label>
            <Input
              id="name"
              value={villageData.name}
              onChange={(e) => setVillageData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter village name"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="province">Province *</Label>
            <Input
              id="province"
              value={villageData.province}
              onChange={(e) => setVillageData(prev => ({ ...prev, province: e.target.value }))}
              placeholder="Enter province"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="district">District *</Label>
            <Input
              id="district"
              value={villageData.district}
              onChange={(e) => setVillageData(prev => ({ ...prev, district: e.target.value }))}
              placeholder="Enter district"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="country">Country *</Label>
            <Input
              id="country"
              value={villageData.country}
              onChange={(e) => setVillageData(prev => ({ ...prev, country: e.target.value }))}
              placeholder="Enter country"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="postalCode">Postal Code *</Label>
            <Input
              id="postalCode"
              value={villageData.postalCode}
              onChange={(e) => setVillageData(prev => ({ ...prev, postalCode: e.target.value }))}
              placeholder="Enter postal code"
              required
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Village"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
