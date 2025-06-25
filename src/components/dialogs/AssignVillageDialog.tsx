import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Search } from "lucide-react";
import { VillageDTO, VillageService } from "@/services/villageService";
import { CreateVillageDialog } from "./CreateVillageDialog";
import { API_CONFIG } from "@/config/api";
import { useToast } from "@/hooks/use-toast";

interface Temple {
  id: number;
  name: string;
  address: string;
  contactNumber: string;
  email: string;
  website: string;
}

interface AssignVillageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  temple: Temple | null;
}

export const AssignVillageDialog = ({ open, onOpenChange, temple }: AssignVillageDialogProps) => {
  const [selectedVillages, setSelectedVillages] = useState<string[]>([]);
  const [villages, setVillages] = useState<VillageDTO[]>([]);
  const [filteredVillages, setFilteredVillages] = useState<VillageDTO[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateVillage, setShowCreateVillage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [assigning, setAssigning] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      loadVillages();
    }
  }, [open]);

  useEffect(() => {
    const filtered = villages.filter(village =>
      village.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      village.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
      village.province.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredVillages(filtered);
  }, [villages, searchTerm]);

  const loadVillages = async () => {
    try {
      setLoading(true);
      const data = await VillageService.getAllVillages();
      setVillages(data);
      setFilteredVillages(data);
    } catch (error) {
      console.error('Failed to load villages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVillageCreated = (newVillage: VillageDTO) => {
    const updatedVillages = [...villages, newVillage];
    setVillages(updatedVillages);
    setFilteredVillages(updatedVillages);
  };

  const handleAssign = async () => {
    if (!temple || selectedVillages.length === 0) return;

    try {
      setAssigning(true);
      const token = localStorage.getItem('authToken');
      
      for (const villageId of selectedVillages) {
        const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.TEMPLE_VILLAGE_ASSIGN}/${villageId}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to assign village ${villageId} to temple`);
        }
      }

      toast({
        title: "Success",
        description: `Successfully assigned ${selectedVillages.length} village(s) to temple`,
      });

      setSelectedVillages([]);
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to assign villages:', error);
      toast({
        title: "Error",
        description: "Failed to assign villages to temple",
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
            <DialogTitle>Assign Villages to Temple</DialogTitle>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Selected Temple</CardTitle>
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

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Select Villages</CardTitle>
                  <Button
                    size="sm"
                    onClick={() => setShowCreateVillage(true)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Create Village
                  </Button>
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
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-4">Loading villages...</div>
                ) : (
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {filteredVillages.length === 0 ? (
                      <div className="text-center py-4 text-gray-500">
                        {searchTerm ? "No villages found matching your search" : "No villages available"}
                      </div>
                    ) : (
                      filteredVillages.map((village) => (
                        <div key={village.id} className="flex items-center space-x-2 p-2 border rounded">
                          <input
                            type="checkbox"
                            id={`village-${village.id}`}
                            className="h-4 w-4 text-orange-600 rounded border-gray-300"
                            onChange={(e) => {
                              const villageId = village.id!.toString();
                              if (e.target.checked) {
                                setSelectedVillages([...selectedVillages, villageId]);
                              } else {
                                setSelectedVillages(selectedVillages.filter(id => id !== villageId));
                              }
                            }}
                          />
                          <label htmlFor={`village-${village.id}`} className="text-sm flex-1 cursor-pointer">
                            <div className="font-medium">{village.name}</div>
                            <div className="text-gray-500">
                              {village.district}, {village.province} - {village.postalCode}
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
              disabled={selectedVillages.length === 0 || assigning}
            >
              {assigning ? "Assigning..." : `Assign Villages (${selectedVillages.length})`}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <CreateVillageDialog
        open={showCreateVillage}
        onOpenChange={setShowCreateVillage}
        onVillageCreated={handleVillageCreated}
      />
    </>
  );
};
