import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Search, MapPin } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { VillageDTO, VillageService } from "@/services/villageService";
import { CreateVillageDialog } from "./CreateVillageDialog";
import { API_CONFIG } from "@/config/api";
import { useToast } from "@/hooks/use-toast";
import { LocationService, Temple } from "@/services/locationService";

interface AssignVillageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  temple: Temple | null;
}

export const AssignVillageDialog = ({ open, onOpenChange, temple }: AssignVillageDialogProps) => {
  const [selectedVillage, setSelectedVillage] = useState<string>('');
  const [villages, setVillages] = useState<VillageDTO[]>([]);
  const [existingVillages, setExistingVillages] = useState<any[]>([]);
  const [filteredVillages, setFilteredVillages] = useState<VillageDTO[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProvince, setSelectedProvince] = useState<string>('all');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');
  const [selectedTown, setSelectedTown] = useState<string>('all');
  const [showCreateVillage, setShowCreateVillage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [assigning, setAssigning] = useState(false);
  const [templeData, setTempleData] = useState<Temple | null>(null);
  const [provinces, setProvinces] = useState<string[]>([]);
  const [districts, setDistricts] = useState<string[]>([]);
  const [towns, setTowns] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (open && temple) {
      loadData();
    }
  }, [open, temple]);

  useEffect(() => {
    applyFilters();
  }, [villages, searchTerm, selectedProvince, selectedDistrict, selectedTown]);

  const loadData = async () => {
    if (!temple) return;

    try {
      setLoading(true);
      const [villagesData, existingData, templeDetails] = await Promise.all([
        VillageService.getAllVillages(),
        LocationService.getVillagesByTemple(temple.id),
        LocationService.getTempleById(temple.id)
      ]);
      
      setVillages(villagesData);
      setExistingVillages(existingData);
      setTempleData(templeDetails);
      
      // Extract unique location data from villages
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
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = villages.filter(village => {
      const matchesSearch = village.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        village.district?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        village.province?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesProvince = selectedProvince === 'all' || village.province === selectedProvince;
      const matchesDistrict = selectedDistrict === 'all' || village.district === selectedDistrict;
      const matchesTown = selectedTown === 'all' || village.town === selectedTown;
      
      return matchesSearch && matchesProvince && matchesDistrict && matchesTown;
    });
    
    setFilteredVillages(filtered);
  };

  const handleProvinceChange = (provinceValue: string) => {
    setSelectedProvince(provinceValue);
    setSelectedDistrict('all');
    setSelectedTown('all');
  };

  const handleDistrictChange = (districtValue: string) => {
    setSelectedDistrict(districtValue);
    setSelectedTown('all');
  };

  const handleVillageCreated = (newVillage: VillageDTO) => {
    const updatedVillages = [...villages, newVillage];
    setVillages(updatedVillages);
  };

  const handleAssign = async () => {
    if (!temple || !selectedVillage) return;

    try {
      setAssigning(true);
      const token = localStorage.getItem('authToken');
      
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.TEMPLE_VILLAGE_ASSIGN}/${selectedVillage}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to assign village to temple`);
      }

      toast({
        title: "Success",
        description: "Successfully assigned village to temple",
      });

      setSelectedVillage('');
      onOpenChange(false);
      loadData(); // Refresh the data
    } catch (error) {
      console.error('Failed to assign village:', error);
      toast({
        title: "Error",
        description: "Failed to assign village to temple",
        variant: "destructive",
      });
    } finally {
      setAssigning(false);
    }
  };

  const getFilteredDistricts = () => {
    if (selectedProvince === 'all') return districts;
    return districts.filter(district => {
      // Find villages with this district and check if they belong to selected province
      return villages.some(village => 
        village.district === district && village.province === selectedProvince
      );
    });
  };

  const getFilteredTowns = () => {
    if (selectedDistrict === 'all') return towns;
    return towns.filter(town => {
      // Find villages with this town and check if they belong to selected district
      return villages.some(village => 
        village.town === town && village.district === selectedDistrict
      );
    });
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Assign Village to Temple</DialogTitle>
          </DialogHeader>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Temple Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Temple Information</CardTitle>
              </CardHeader>
              <CardContent>
                {temple && (
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm text-gray-500">Temple Name</p>
                      <p className="font-medium">{temple.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Address</p>
                      <p className="text-sm">{temple.address}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Contact</p>
                      <p className="text-sm">{temple.contactNumber}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Existing Villages */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Existing Villages</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {existingVillages.length === 0 ? (
                    <div className="text-center py-4 text-gray-500">
                      No villages assigned yet
                    </div>
                  ) : (
                    existingVillages.map((item, index) => (
                      <div key={index} className="p-2 border rounded bg-gray-50">
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2 text-green-600" />
                          <div>
                            <div className="font-medium">{item.village?.name}</div>
                            <div className="text-sm text-gray-500">
                              {item.village?.district}, {item.village?.province}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Select New Village */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Select Village</CardTitle>
                  <Button
                    size="sm"
                    onClick={() => setShowCreateVillage(true)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Create Village
                  </Button>
                </div>
                
                {/* Filters */}
                <div className="space-y-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search villages..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 gap-2">
                    <div>
                      <Label className="text-xs">Province</Label>
                      <Select value={selectedProvince} onValueChange={handleProvinceChange}>
                        <SelectTrigger className="h-8">
                          <SelectValue placeholder="All provinces" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All provinces</SelectItem>
                          {provinces.map((province) => (
                            <SelectItem key={province} value={province}>
                              {province}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label className="text-xs">District</Label>
                      <Select 
                        value={selectedDistrict} 
                        onValueChange={handleDistrictChange}
                        disabled={selectedProvince === 'all'}
                      >
                        <SelectTrigger className="h-8">
                          <SelectValue placeholder="All districts" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All districts</SelectItem>
                          {getFilteredDistricts().map((district) => (
                            <SelectItem key={district} value={district}>
                              {district}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label className="text-xs">Town</Label>
                      <Select 
                        value={selectedTown} 
                        onValueChange={setSelectedTown}
                        disabled={selectedDistrict === 'all'}
                      >
                        <SelectTrigger className="h-8">
                          <SelectValue placeholder="All towns" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All towns</SelectItem>
                          {getFilteredTowns().map((town) => (
                            <SelectItem key={town} value={town}>
                              {town}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-4">Loading villages...</div>
                ) : (
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {filteredVillages.length === 0 ? (
                      <div className="text-center py-4 text-gray-500">
                        No villages found
                      </div>
                    ) : (
                      filteredVillages.map((village) => (
                        <div key={village.id} className="flex items-center space-x-2 p-2 border rounded">
                          <input
                            type="radio"
                            id={`village-${village.id}`}
                            name="village"
                            className="h-4 w-4 text-orange-600"
                            onChange={() => setSelectedVillage(village.id!.toString())}
                            checked={selectedVillage === village.id!.toString()}
                          />
                          <label htmlFor={`village-${village.id}`} className="text-sm flex-1 cursor-pointer">
                            <div className="font-medium">{village.name}</div>
                            <div className="text-gray-500 text-xs">
                              {village.town && `${village.town}, `}{village.district}, {village.province} - {village.postalCode}
                            </div>
                          </label>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleAssign} 
              className="bg-orange-600 hover:bg-orange-700"
              disabled={!selectedVillage || assigning}
            >
              {assigning ? "Assigning..." : "Assign Village"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <CreateVillageDialog
        open={showCreateVillage}
        onOpenChange={setShowCreateVillage}
        onVillageCreated={handleVillageCreated}
        templeId={temple?.id || 0}
      />
    </>
  );
};
