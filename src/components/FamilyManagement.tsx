
import { useState } from "react";
import { Plus, Search, Edit, Trash, Users, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AssignMemberDialog } from "@/components/dialogs/AssignMemberDialog";
import { AssignFamilyToTempleDialog } from "@/components/dialogs/AssignFamilyToTempleDialog";

interface Family {
  id: number;
  familyName: string;
  address: string;
  telephone: string;
}

export const FamilyManagement = () => {
  const [families, setFamilies] = useState<Family[]>([
    {
      id: 1,
      familyName: "Perera Family",
      address: "No 123, Temple Road, Maligawatta",
      telephone: "0112695161"
    },
    {
      id: 2,
      familyName: "Silva Family",
      address: "No 456, Lake Road, Dematagoda",
      telephone: "0112435127"
    },
    {
      id: 3,
      familyName: "Fernando Family",
      address: "No 789, Station Road, Maradana",
      telephone: "0112691378"
    },
    {
      id: 4,
      familyName: "Gunasekara Family",
      address: "No 45, Main Street, Grandpass",
      telephone: "0112412567"
    },
    {
      id: 5,
      familyName: "Rajapaksa Family",
      address: "No 67, Church Road, Mattakkuliya",
      telephone: "0112529876"
    }
  ]);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [showAssignMember, setShowAssignMember] = useState(false);
  const [showAssignToTemple, setShowAssignToTemple] = useState(false);
  const [selectedFamily, setSelectedFamily] = useState<Family | null>(null);

  const filteredFamilies = families.filter(family =>
    family.familyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    family.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAssignMember = (family: Family) => {
    setSelectedFamily(family);
    setShowAssignMember(true);
  };

  const handleAssignToTemple = (family: Family) => {
    setSelectedFamily(family);
    setShowAssignToTemple(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Family Management</h2>
          <p className="text-gray-600 mt-1">Manage family information and members</p>
        </div>
        <Button className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-sm sm:text-base px-4 py-2 h-10 sm:h-auto">
          <Plus className="h-4 w-4 mr-2" />
          Add Family
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search families..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Family Name</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Telephone</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFamilies.map((family) => (
                <TableRow key={family.id}>
                  <TableCell className="font-medium">{family.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-purple-600" />
                      <span className="font-medium">{family.familyName}</span>
                    </div>
                  </TableCell>
                  <TableCell>{family.address}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span>{family.telephone}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-2">
                      <Button 
                        size="sm" 
                        onClick={() => handleAssignMember(family)}
                        className="bg-blue-600 hover:bg-blue-700 text-xs"
                      >
                        Assign Member
                      </Button>
                      <Button 
                        size="sm" 
                        onClick={() => handleAssignToTemple(family)}
                        className="bg-green-600 hover:bg-green-700 text-xs"
                      >
                        Assign to Temple
                      </Button>
                      <Button size="sm" variant="outline" className="text-xs">
                        <Edit className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                      <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700 text-xs">
                        <Trash className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AssignMemberDialog 
        open={showAssignMember}
        onOpenChange={setShowAssignMember}
        family={selectedFamily}
      />

      <AssignFamilyToTempleDialog 
        open={showAssignToTemple}
        onOpenChange={setShowAssignToTemple}
        family={selectedFamily}
      />
    </div>
  );
};
