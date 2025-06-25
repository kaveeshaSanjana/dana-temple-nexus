
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Family {
  id: number;
  familyName: string;
  address: string;
  telephone: string;
}

interface Temple {
  id: number;
  name: string;
  address: string;
}

interface AssignFamilyToTempleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  family: Family | null;
}

export const AssignFamilyToTempleDialog = ({ open, onOpenChange, family }: AssignFamilyToTempleDialogProps) => {
  const [selectedTemple, setSelectedTemple] = useState<string>("");
  
  const temples: Temple[] = [
    { id: 1, name: "Sri Maha Bodhi Temple", address: "123 Temple Street, Colombo" },
    { id: 2, name: "Temple of Peace", address: "456 Serenity Road, Kandy" },
    { id: 3, name: "Gangaramaya Temple", address: "789 Lake Road, Colombo" },
  ];

  const handleAssign = () => {
    console.log("Assigning family:", family?.id, "to temple:", selectedTemple);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Assign Family to Temple</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Selected Family</CardTitle>
            </CardHeader>
            <CardContent>
              {family && (
                <div className="space-y-2">
                  <div>
                    <p className="text-sm text-gray-500">Family ID</p>
                    <p className="font-medium">{family.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Family Name</p>
                    <p className="font-medium">{family.familyName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Address</p>
                    <p className="text-sm">{family.address}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Telephone</p>
                    <p className="text-sm">{family.telephone}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Select Temple</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Select value={selectedTemple} onValueChange={setSelectedTemple}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a temple" />
                  </SelectTrigger>
                  <SelectContent>
                    {temples.map((temple) => (
                      <SelectItem key={temple.id} value={temple.id.toString()}>
                        {temple.name} - {temple.address}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleAssign} className="bg-green-600 hover:bg-green-700">
            Assign to Temple
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
