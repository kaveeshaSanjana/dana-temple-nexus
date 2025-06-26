
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { VillageDTO, VillageService } from "@/services/villageService";
import { Temple, LocationService } from "@/services/locationService";

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
  const [allVillages, setAllVillages] = useState<VillageDTO[]>([]);
  const [provinces, setProvinces] = useState<string[]>([]);
  const [districts, setDistricts] = useState<string[]>([]);
  const [towns, setTowns] = useState<string[]>([]);

  useEffect(() => {
    if (open && templeId) {
      loadData();
    }
  }, [open, templeId]);

  const loadData = async () => {
    try {
      const [templeData, villagesData] = await Promise.all([
        LocationService.getTempleById(templeId),
        VillageService.getAllVillages()
      ]);
      
      setTemple(templeData);
      setAllVillages(villagesData);
      
      // Extract unique location data from all villages
      const uniqueProvinces = new Set<string>();
      const uniqueDistricts = new Set<string>();
      const uniqueTowns = new Set<string>();
      
      villagesData.forEach(village => {
        if (village.province) {
          uniqueProvinces.add(village.province);
        }
        if (village.district) {
          uniqueDistricts.add(village.district);
        }
        if (village.town) {
          uniqueTowns.add(village.town);
        }
      });
      
      setProvinces(Array.from(uniqueProvinces));
      setDistricts(Array.from(uniqueDistricts));
      setTowns(Array.from(uniqueTowns));
    } catch (error) {
      console.error('Failed to load data:', error);
    }
  };

  const handleProvinceChange = (provinceValue: string) => {
    setVillageData(prev => ({ 
      ...prev, 
      province: provinceValue,
      district: '',
      town: ''
    }));
    
    // Filter districts based on selected province
    const relatedDistricts = allVillages
      .filter(v => v.province === provinceValue && v.district)
      .map(v => v.district!)
      .filter((value, index, self) => self.indexOf(value) === index);
    
    setDistricts(relatedDistricts);
    setTowns([]);
  };

  const handleDistrictChange = (districtValue: string) => {
    setVillageData(prev => ({ 
      ...prev, 
      district: districtValue,
      town: ''
    }));
    
    // Filter towns based on selected district and province
    const relatedTowns = allVillages
      .filter(v => v.district === districtValue && v.province === villageData.province && v.town)
      .map(v => v.town!)
      .filter((value, index, self) => self.indexOf(value) === index);
    
    setTowns(relatedTowns);
  };

  const handleTownChange = (townValue: string) => {
    setVillageData(prev => ({ ...prev, town: townValue }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!villageData.province || !villageData.district) {
      console.error('Please select province and district');
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

  const getFilteredDistricts = () => {
    if (!villageData.province) return [];
    return allVillages
      .filter(v => v.province === villageData.province && v.district)
      .map(v => v.district!)
      .filter((value, index, self) => self.indexOf(value) === index);
  };

  const getFilteredTowns = () => {
    if (!villageData.district) return [];
    return allVillages
      .filter(v => v.district === villageData.district && v.province === villageData.province && v.town)
      .map(v => v.town!)
      .filter((value, index, self) => self.indexOf(value) === index);
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
            <Select onValueChange={handleProvinceChange} value={villageData.province || ''}>
              <SelectTrigger>
                <SelectValue placeholder="Select province" />
              </SelectTrigger>
              <SelectContent>
                {provinces.map((province) => (
                  <SelectItem key={province} value={province}>
                    {province}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="district">District *</Label>
            <Select 
              onValueChange={handleDistrictChange} 
              value={villageData.district || ''}
              disabled={!villageData.province}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select district" />
              </SelectTrigger>
              <SelectContent>
                {getFilteredDistricts().map((district) => (
                  <SelectItem key={district} value={district}>
                    {district}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="town">Town</Label>
            <Select 
              onValueChange={handleTownChange} 
              value={villageData.town || ''}
              disabled={!villageData.district}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select town (optional)" />
              </SelectTrigger>
              <SelectContent>
                {getFilteredTowns().map((town) => (
                  <SelectItem key={town} value={town}>
                    {town}
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
