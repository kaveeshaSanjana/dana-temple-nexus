
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { VillageDTO, VillageService } from "@/services/villageService";
import { Temple, Province, District, Town, LocationService } from "@/services/locationService";

interface CreateVillageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onVillageCreated: (village: VillageDTO) => void;
  templeId: number;
}

export const CreateVillageDialog = ({ open, onOpenChange, onVillageCreated, templeId }: CreateVillageDialogProps) => {
  const [villageData, setVillageData] = useState<Partial<VillageDTO>>({
    name: '',
    country: 'Sri Lanka',
    postalCode: ''
  });
  const [loading, setLoading] = useState(false);
  const [temple, setTemple] = useState<Temple | null>(null);
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [towns, setTowns] = useState<Town[]>([]);

  useEffect(() => {
    if (open && templeId) {
      loadTempleData();
    }
  }, [open, templeId]);

  const loadTempleData = async () => {
    try {
      const templeData = await LocationService.getTempleById(templeId);
      setTemple(templeData);
      
      // Extract unique provinces, districts, and towns from temple data
      // For now, we'll use the temple's location as available options
      if (templeData.province) {
        setProvinces([templeData.province]);
        if (templeData.district) {
          setDistricts([templeData.district]);
          if (templeData.town) {
            setTowns([templeData.town]);
          }
        }
      }
    } catch (error) {
      console.error('Failed to load temple data:', error);
    }
  };

  const handleProvinceChange = (provinceId: string) => {
    const selectedProvince = provinces.find(p => p.id.toString() === provinceId);
    if (selectedProvince) {
      setVillageData(prev => ({ 
        ...prev, 
        province: selectedProvince,
        district: undefined,
        town: undefined
      }));
      
      // Filter districts based on selected province
      const relatedDistricts = districts.filter(d => d.province.id === selectedProvince.id);
      setDistricts(relatedDistricts);
      setTowns([]);
    }
  };

  const handleDistrictChange = (districtId: string) => {
    const selectedDistrict = districts.find(d => d.id.toString() === districtId);
    if (selectedDistrict) {
      setVillageData(prev => ({ 
        ...prev, 
        district: selectedDistrict,
        town: undefined
      }));
      
      // Filter towns based on selected district
      const relatedTowns = towns.filter(t => t.district.id === selectedDistrict.id);
      setTowns(relatedTowns);
    }
  };

  const handleTownChange = (townId: string) => {
    const selectedTown = towns.find(t => t.id.toString() === townId);
    if (selectedTown) {
      setVillageData(prev => ({ ...prev, town: selectedTown }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!villageData.province || !villageData.district || !villageData.town) {
      console.error('Please select province, district, and town');
      return;
    }

    try {
      setLoading(true);
      const newVillage = await VillageService.createVillage(villageData as VillageDTO);
      onVillageCreated(newVillage);
      onOpenChange(false);
      setVillageData({
        name: '',
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
              value={villageData.name || ''}
              onChange={(e) => setVillageData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter village name"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="province">Province *</Label>
            <Select onValueChange={handleProvinceChange} value={villageData.province?.id.toString() || ''}>
              <SelectTrigger>
                <SelectValue placeholder="Select province" />
              </SelectTrigger>
              <SelectContent>
                {provinces.map((province) => (
                  <SelectItem key={province.id} value={province.id.toString()}>
                    {province.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="district">District *</Label>
            <Select 
              onValueChange={handleDistrictChange} 
              value={villageData.district?.id.toString() || ''}
              disabled={!villageData.province}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select district" />
              </SelectTrigger>
              <SelectContent>
                {districts.map((district) => (
                  <SelectItem key={district.id} value={district.id.toString()}>
                    {district.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="town">Town *</Label>
            <Select 
              onValueChange={handleTownChange} 
              value={villageData.town?.id.toString() || ''}
              disabled={!villageData.district}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select town" />
              </SelectTrigger>
              <SelectContent>
                {towns.map((town) => (
                  <SelectItem key={town.id} value={town.id.toString()}>
                    {town.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="country">Country *</Label>
            <Input
              id="country"
              value={villageData.country || ''}
              onChange={(e) => setVillageData(prev => ({ ...prev, country: e.target.value }))}
              placeholder="Enter country"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="postalCode">Postal Code *</Label>
            <Input
              id="postalCode"
              value={villageData.postalCode || ''}
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
