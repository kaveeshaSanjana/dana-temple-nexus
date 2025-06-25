
import { useState } from "react";
import { Plus, Search, Edit, Trash, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Village {
  id: number;
  name: string;
  province: string;
  district: string;
  country: string;
  postalCode: string;
  familyCount: number;
}

export const VillageManagement = () => {
  const [villages, setVillages] = useState<Village[]>([
    {
      id: 1,
      name: "Colombo Village",
      province: "Western",
      district: "Colombo",
      country: "Sri Lanka",
      postalCode: "00100",
      familyCount: 45
    },
    {
      id: 2,
      name: "Kandy Village",
      province: "Central",
      district: "Kandy",
      country: "Sri Lanka",
      postalCode: "20000",
      familyCount: 32
    },
    {
      id: 3,
      name: "Galle Village",
      province: "Southern",
      district: "Galle",
      country: "Sri Lanka",
      postalCode: "80000",
      familyCount: 28
    }
  ]);
  
  const [searchTerm, setSearchTerm] = useState("");

  const filteredVillages = villages.filter(village =>
    village.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    village.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
    village.province.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Village Management</h2>
          <p className="text-gray-600 mt-1">Manage village information and locations</p>
        </div>
        <Button className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-sm sm:text-base px-4 py-2 h-10 sm:h-auto">
          <Plus className="h-4 w-4 mr-2" />
          Add Village
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVillages.map((village) => (
              <Card key={village.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-base sm:text-lg text-green-800 flex items-center">
                      <MapPin className="h-4 w-4 mr-2" />
                      {village.name}
                    </CardTitle>
                    <Badge variant="secondary" className="text-xs">{village.familyCount} families</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-500">Province</p>
                    <p className="text-xs sm:text-sm font-medium">{village.province}</p>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-gray-500">District</p>
                    <p className="text-xs sm:text-sm font-medium">{village.district}</p>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-gray-500">Country</p>
                    <p className="text-xs sm:text-sm font-medium">{village.country}</p>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-gray-500">Postal Code</p>
                    <p className="text-xs sm:text-sm font-medium">{village.postalCode}</p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 pt-2">
                    <Button size="sm" variant="outline" className="flex-1 text-xs sm:text-sm px-3 py-2 h-8 sm:h-9">
                      <Edit className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                      Edit
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1 text-red-600 hover:text-red-700 text-xs sm:text-sm px-3 py-2 h-8 sm:h-9">
                      <Trash className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
