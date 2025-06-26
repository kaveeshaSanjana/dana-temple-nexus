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
  const [existingVillages, setExistingVillages] = useState<VillageDTO[]>([]);
  const [filteredVillages, setFilteredVillages] = useState<VillageDTO[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProvince, setSelectedProvince] = useState<string>('');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('');
  const [selectedTown, setSelectedTown] = useState<string>('');
  const [showCreateVillage, setShowCreateVillage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [assigning, setAssigning] = useState(false);
  const [templeData, setTempleData] = useState<Temple | null>(null);
  const { toast } = useToast();

  // Predefined enum values - you may need to adjust these based on your backend
  const provinces = ['WESTERN', 'CENTRAL', 'SOUTHERN', 'NORTHERN', 'EASTERN', 'NORTH_WESTERN', 'NORTH_CENTRAL', 'UVA', 'SABARAGAMUWA'];
  const districts = ['COLOMBO', 'GAMPAHA', 'KALUTARA', 'KANDY', 'MATALE', 'NUWARA_ELIYA', 'GALLE', 'MATARA', 'HAMBANTOTA', 'JAFFNA', 'KILINOCHCHI', 'MANNAR', 'MULLAITIVU', 'VAVUNIYA', 'BATTICALOA', 'AMPARA', 'TRINCOMALEE', 'KURUNEGALA', 'PUTTALAM', 'ANURADHAPURA', 'POLONNARUWA', 'BADULLA', 'MONERAGALA', 'RATNAPURA', 'KEGALLE'];
  const towns = ['COLOMBO', 'DEHIWALA', 'MORATUWA', 'KOTTE', 'MAHARAGAMA', 'KESBEWA', 'KADUWELA', 'HOMAGAMA', 'KANDY', 'PERADENIYA', 'GAMPOLA', 'NAWALAPITIYA', 'GALLE', 'HIKKADUWA', 'AMBALANGODA', 'BENTARA'];

  useEffect(() => {
    if (open && temple) {
      loadInitialData();
    }
  }, [open, temple]);

  useEffect(() => {
    applyFilters();
  }, [villages, searchTerm]);

  const loadInitialData = async () => {
    if (!temple) return;

    try {
      setLoading(true);
      const [templeDetails, existingData] = await Promise.all([
        LocationService.getTempleById(temple.id),
        VillageService.getVillagesByTemple(temple.id)
      ]);
      
      setTempleData(templeDetails);
      setExistingVillages(existingData);
      
      // Set dropdowns based on temple location data
      if (templeDetails.province) {
        setSelectedProvince(templeDetails.province);
      }
      if (templeDetails.district) {
        setSelectedDistrict(templeDetails.district);
      }
      if (templeDetails.town) {
        setSelectedTown(templeDetails.town);
        // If temple has complete location data, load filtered villages
        await loadFilteredVillages(templeDetails.province, templeDetails.district, templeDetails.town);
      }
    } catch (error) {
      console.error('Failed to load initial data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadFilteredVillages = async (province?: string, district?: string, town?: string) => {
    try {
      setLoading(true);
      const filteredData = await VillageService.getFilteredVillages(province, district, town);
      setVillages(filteredData);
    } catch (error) {
      console.error('Failed to load filtered villages:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = villages.filter(village => {
      const matchesSearch = village.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        village.district?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        village.province?.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesSearch;
    });
    
    setFilteredVillages(filtered);
  };

  const handleProvinceChange = (provinceValue: string) => {
    setSelectedProvince(provinceValue);
    setSelectedDistrict('');
    setSelectedTown('');
    setVillages([]);
    setFilteredVillages([]);
  };

  const handleDistrictChange = (districtValue: string) => {
    setSelectedDistrict(districtValue);
    setSelectedTown('');
    setVillages([]);
    setFilteredVillages([]);
  };

  const handleTownChange = async (townValue: string) => {
    setSelectedTown(townValue);
    // Load filtered villages when town is selected
    if (selectedProvince && selectedDistrict) {
      await loadFilteredVillages(selectedProvince, selectedDistrict, townValue);
    }
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
      loadInitialData(); // Refresh the data
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

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Assign Village to Temple</DialogTitle>
          </DialogHeader>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                    existingVillages.map((village, index) => (
                      <div key={index} className="p-2 border rounded bg-gray-50">
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2 text-green-600" />
                          <div>
                            <div className="font-medium">{village.name}</div>
                            <div className="text-sm text-gray-500">
                              {village.district}, {village.province}
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
                  <div className="grid grid-cols-1 gap-2">
                    <div>
                      <Label className="text-xs">Province</Label>
                      <Select value={selectedProvince} onValueChange={handleProvinceChange}>
                        <SelectTrigger className="h-8">
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
                      <Label className="text-xs">District</Label>
                      <Select 
                        value={selectedDistrict} 
                        onValueChange={handleDistrictChange}
                        disabled={!selectedProvince}
                      >
                        <SelectTrigger className="h-8">
                          <SelectValue placeholder="Select district" />
                        </SelectTrigger>
                        <SelectContent>
                          {districts.map((district) => (
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
                        onValueChange={handleTownChange}
                        disabled={!selectedDistrict}
                      >
                        <SelectTrigger className="h-8">
                          <SelectValue placeholder="Select town" />
                        </SelectTrigger>
                        <SelectContent>
                          {towns.map((town) => (
                            <SelectItem key={town} value={town}>
                              {town}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search villages..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
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
                        {selectedTown ? "No villages found" : "Select province, district, and town to view villages"}
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
