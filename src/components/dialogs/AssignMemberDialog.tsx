
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

interface Member {
  id: number;
  name: string;
  phoneNumber: string;
}

interface AssignMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  family: Family | null;
}

export const AssignMemberDialog = ({ open, onOpenChange, family }: AssignMemberDialogProps) => {
  const [selectedMember, setSelectedMember] = useState<string>("");
  
  const members: Member[] = [
    { id: 1, name: "John Perera", phoneNumber: "0771234567" },
    { id: 2, name: "Mary Silva", phoneNumber: "0779876543" },
    { id: 3, name: "David Fernando", phoneNumber: "0765432109" },
    { id: 4, name: "Sarah Gunasekara", phoneNumber: "0712345678" },
  ];

  const handleAssign = () => {
    console.log("Assigning member:", selectedMember, "to family:", family?.id);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Assign Member to Family</DialogTitle>
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
              <CardTitle className="text-lg">Select Member</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Select value={selectedMember} onValueChange={setSelectedMember}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a member to assign" />
                  </SelectTrigger>
                  <SelectContent>
                    {members.map((member) => (
                      <SelectItem key={member.id} value={member.id.toString()}>
                        {member.id} - {member.name} - {member.phoneNumber}
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
          <Button onClick={handleAssign} className="bg-blue-600 hover:bg-blue-700">
            Assign Member
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
