
import { useState } from "react";
import { Calendar, Heart, Building, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const DanaAssignmentForm = () => {
  const [selectedTemple, setSelectedTemple] = useState("");
  const [selectedDana, setSelectedDana] = useState("");
  const [selectedFamily, setSelectedFamily] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  const temples = [
    { id: 1, name: "Sri Vajiraramaya" },
    { id: 2, name: "Gangaramaya" },
    { id: 3, name: "Dipaduttaramaya" },
  ];

  const danas = [
    { id: 1, name: "Morning Heel Dana", time: "MORNING" },
    { id: 2, name: "Buddha Pooja", time: "AFTERNOON" },
    { id: 3, name: "Evening Dana", time: "EVENING" },
  ];

  const families = [
    { id: 1, name: "Perera Family" },
    { id: 2, name: "Silva Family" },
    { id: 3, name: "Fernando Family" },
    { id: 4, name: "Gunasekara Family" },
    { id: 5, name: "Rajapaksa Family" },
  ];

  const handleAssignDana = () => {
    console.log("Assigning Dana:", {
      temple: selectedTemple,
      dana: selectedDana,
      family: selectedFamily,
      date: selectedDate
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Dana Assignment Form</h2>
        <p className="text-gray-600 mt-1">Create new dana assignments for families</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Heart className="h-5 w-5 mr-2 text-red-600" />
            Assign Dana to Family
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="temple" className="flex items-center mb-2">
                  <Building className="h-4 w-4 mr-2" />
                  Select Temple
                </Label>
                <Select value={selectedTemple} onValueChange={setSelectedTemple}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a temple" />
                  </SelectTrigger>
                  <SelectContent>
                    {temples.map((temple) => (
                      <SelectItem key={temple.id} value={temple.id.toString()}>
                        {temple.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="dana" className="flex items-center mb-2">
                  <Heart className="h-4 w-4 mr-2" />
                  Select Dana Type
                </Label>
                <Select value={selectedDana} onValueChange={setSelectedDana}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose dana type" />
                  </SelectTrigger>
                  <SelectContent>
                    {danas.map((dana) => (
                      <SelectItem key={dana.id} value={dana.id.toString()}>
                        {dana.name} ({dana.time})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="date" className="flex items-center mb-2">
                  <Calendar className="h-4 w-4 mr-2" />
                  Select Date
                </Label>
                <Input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="family" className="flex items-center mb-2">
                  <Users className="h-4 w-4 mr-2" />
                  Select Family
                </Label>
                <Select value={selectedFamily} onValueChange={setSelectedFamily}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a family" />
                  </SelectTrigger>
                  <SelectContent>
                    {families.map((family) => (
                      <SelectItem key={family.id} value={family.id.toString()}>
                        {family.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <Button 
              onClick={handleAssignDana}
              className="bg-indigo-600 hover:bg-indigo-700"
              disabled={!selectedTemple || !selectedDana || !selectedFamily || !selectedDate}
            >
              Assign Dana
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
