
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Clock } from "lucide-react";
import { danaService, DanaType } from "@/services/danaService";
import { useToast } from "@/hooks/use-toast";

interface AddDanaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export const AddDanaDialog = ({ open, onOpenChange, onSuccess }: AddDanaDialogProps) => {
  const [danaTypes, setDanaTypes] = useState<DanaType[]>([]);
  const [selectedDanaId, setSelectedDanaId] = useState<string>("");
  const [minCount, setMinCount] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [fetchingDanas, setFetchingDanas] = useState(false);
  const { toast } = useToast();

  const getTimeColor = (time: string) => {
    switch (time) {
      case "MORNING": return "bg-yellow-100 text-yellow-800";
      case "AFTERNOON": return "bg-orange-100 text-orange-800";
      case "EVENING": return "bg-purple-100 text-purple-800";
      case "NIGHT": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  useEffect(() => {
    if (open) {
      fetchDanaTypes();
    }
  }, [open]);

  const fetchDanaTypes = async () => {
    setFetchingDanas(true);
    try {
      const data = await danaService.getAllDanaTypes();
      setDanaTypes(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch dana types",
        variant: "destructive",
      });
    } finally {
      setFetchingDanas(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedDanaId || !minCount) {
      toast({
        title: "Error",
        description: "Please select a dana type and enter minimum count",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      await danaService.assignDanaToTemple(parseInt(selectedDanaId), parseInt(minCount));
      toast({
        title: "Success",
        description: "Dana type assigned successfully",
      });
      onSuccess();
      onOpenChange(false);
      setSelectedDanaId("");
      setMinCount("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to assign dana type",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const selectedDana = danaTypes.find(dana => dana.id.toString() === selectedDanaId);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add Dana Type</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {fetchingDanas ? (
            <div className="text-center py-4">Loading dana types...</div>
          ) : (
            <>
              <div className="space-y-2">
                <Label htmlFor="danaType">Select Dana Type</Label>
                <Select value={selectedDanaId} onValueChange={setSelectedDanaId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a dana type" />
                  </SelectTrigger>
                  <SelectContent>
                    {danaTypes.map((dana) => (
                      <SelectItem key={dana.id} value={dana.id.toString()}>
                        {dana.name} - {dana.time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedDana && (
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Heart className="h-4 w-4 text-red-600" />
                        <h3 className="font-semibold">{selectedDana.name}</h3>
                      </div>
                      <Badge className={`${getTimeColor(selectedDana.time)} text-xs`}>
                        <Clock className="h-3 w-3 mr-1" />
                        {selectedDana.time}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{selectedDana.description}</p>
                  </CardContent>
                </Card>
              )}

              <div className="space-y-2">
                <Label htmlFor="minCount">Minimum Number of Families</Label>
                <Input
                  id="minCount"
                  type="number"
                  min="1"
                  placeholder="Enter minimum count"
                  value={minCount}
                  onChange={(e) => setMinCount(e.target.value)}
                />
              </div>
            </>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={loading || !selectedDanaId || !minCount}
          >
            {loading ? "Adding..." : "Add Dana Type"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
