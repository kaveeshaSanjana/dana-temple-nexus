
import { useState } from "react";
import { Plus, Search, Edit, Trash, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AssignVillageDialog } from "@/components/dialogs/AssignVillageDialog";

interface Temple {
  id: number;
  name: string;
  address: string;
  contactNumber: string;
  email: string;
  website: string;
}

export const TempleManagement = () => {
  const [temples, setTemples] = useState<Temple[]>([
    {
      id: 1,
      name: "Sri Maha Bodhi Temple",
      address: "123 Temple Street, Colombo",
      contactNumber: "+94 11 234 5678",
      email: "info@mahabodhi.lk",
      website: "www.mahabodhi.lk"
    },
    {
      id: 2,
      name: "Temple of Peace",
      address: "456 Serenity Road, Kandy",
      contactNumber: "+94 81 987 6543",
      email: "contact@peacetemple.lk",
      website: "www.peacetemple.lk"
    }
  ]);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [showAssignVillage, setShowAssignVillage] = useState(false);
  const [selectedTemple, setSelectedTemple] = useState<Temple | null>(null);

  const filteredTemples = temples.filter(temple =>
    temple.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    temple.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAssignVillage = (temple: Temple) => {
    setSelectedTemple(temple);
    setShowAssignVillage(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Temple Management</h2>
          <p className="text-gray-600 mt-1">Manage temple information and details</p>
        </div>
        <Button 
          onClick={() => setShowForm(true)}
          className="w-full sm:w-auto bg-orange-600 hover:bg-orange-700 text-sm sm:text-base px-4 py-2 h-10 sm:h-auto"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Temple
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search temples..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemples.map((temple) => (
              <Card key={temple.id} className="hover:shadow-lg transition-shadow">
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
                    <Button 
                      size="sm" 
                      onClick={() => handleAssignVillage(temple)}
                      className="w-full bg-green-600 hover:bg-green-700 text-xs sm:text-sm px-3 py-2 h-8 sm:h-9"
                    >
                      <MapPin className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                      Assign Village
                    </Button>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1 text-xs sm:text-sm px-3 py-2 h-8 sm:h-9">
                        <Edit className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                        Edit
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1 text-red-600 hover:text-red-700 text-xs sm:text-sm px-3 py-2 h-8 sm:h-9">
                        <Trash className="h-3 w-3 sm:h-4 sm:w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <AssignVillageDialog 
        open={showAssignVillage}
        onOpenChange={setShowAssignVillage}
        temple={selectedTemple}
      />
    </div>
  );
};
