
import { useState, useEffect } from "react";
import { Search, Edit, Trash, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AssignVillageDialog } from "@/components/dialogs/AssignVillageDialog";
import { useToast } from "@/hooks/use-toast";

interface Temple {
  id: number;
  name: string;
  address: string;
  contactNumber: string;
  email: string;
  website: string;
}

export const TempleManagement = () => {
  const [temple, setTemple] = useState<Temple | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [showAssignVillage, setShowAssignVillage] = useState(false);
  const { toast } = useToast();

  const getTempleId = () => {
    const authToken = localStorage.getItem('authToken');
    if (authToken) {
      try {
        // Parse JWT token to get temple ID
        const payload = JSON.parse(atob(authToken.split('.')[1]));
        return payload.templeId;
      } catch (error) {
        console.error('Error parsing auth token:', error);
      }
    }
    return null;
  };

  const getUserType = () => {
    return localStorage.getItem('userType') || '';
  };

  useEffect(() => {
    const userType = getUserType();
    if (userType !== 'MEMBER') {
      fetchTempleData();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchTempleData = async () => {
    setLoading(true);
    try {
      const templeId = getTempleId();
      if (!templeId) {
        toast({
          title: "Error",
          description: "Temple ID not found",
          variant: "destructive",
        });
        return;
      }

      const token = localStorage.getItem('authToken');
      const response = await fetch(`http://localhost:8081/api/temple/${templeId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch temple data');
      }

      const templeData = await response.json();
      setTemple(templeData);
    } catch (error) {
      console.error('Error fetching temple data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch temple information",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAssignVillage = () => {
    if (temple) {
      setShowAssignVillage(true);
    }
  };

  const userType = getUserType();

  if (userType === 'MEMBER') {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Temple Management</h2>
          <p className="text-gray-600 mt-1">Access restricted for members</p>
        </div>
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-gray-500">You don't have permission to access temple management features.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Temple Management</h2>
          <p className="text-gray-600 mt-1">Loading temple information...</p>
        </div>
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-gray-500">Loading...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!temple) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Temple Management</h2>
          <p className="text-gray-600 mt-1">Temple information not found</p>
        </div>
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-gray-500">No temple data available</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Temple Management</h2>
          <p className="text-gray-600 mt-1">Manage temple information and details</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search temple information..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-6">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-base sm:text-lg text-orange-800">{temple.name}</CardTitle>
                  <Badge variant="secondary" className="text-xs">Active</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-xs sm:text-sm text-gray-500">Address</p>
                  <p className="text-xs sm:text-sm font-medium">{temple.address}</p>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-gray-500">Contact</p>
                  <p className="text-xs sm:text-sm font-medium">{temple.contactNumber}</p>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-gray-500">Email</p>
                  <p className="text-xs sm:text-sm font-medium">{temple.email}</p>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-gray-500">Website</p>
                  <p className="text-xs sm:text-sm font-medium text-blue-600">{temple.website}</p>
                </div>
                <div className="flex flex-col gap-2 pt-2">
                  <button 
                    onClick={handleAssignVillage}
                    className="w-full bg-green-600 hover:bg-green-700 text-white text-xs sm:text-sm px-3 py-2 h-8 sm:h-9 rounded flex items-center justify-center"
                  >
                    <MapPin className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    Assign Village
                  </button>
                  <div className="flex gap-2">
                    <button className="flex-1 border border-gray-300 hover:bg-gray-50 text-xs sm:text-sm px-3 py-2 h-8 sm:h-9 rounded flex items-center justify-center">
                      <Edit className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                      Edit
                    </button>
                    <button className="flex-1 border border-gray-300 text-red-600 hover:text-red-700 hover:bg-red-50 text-xs sm:text-sm px-3 py-2 h-8 sm:h-9 rounded flex items-center justify-center">
                      <Trash className="h-3 w-3 sm:h-4 sm:w-4" />
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      <AssignVillageDialog 
        open={showAssignVillage}
        onOpenChange={setShowAssignVillage}
        temple={temple}
      />
    </div>
  );
};
