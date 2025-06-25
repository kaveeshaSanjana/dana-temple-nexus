
import { useState, useEffect } from "react";
import { Plus, Search, Edit, Trash, Heart, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AddDanaDialog } from "@/components/dialogs/AddDanaDialog";
import { danaService, TempleDana } from "@/services/danaService";
import { useToast } from "@/hooks/use-toast";

export const DanaManagement = () => {
  const [templeDanas, setTempleDanas] = useState<TempleDana[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
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

  useEffect(() => {
    fetchTempleDanas();
  }, []);

  const fetchTempleDanas = async () => {
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

      const data = await danaService.getTempleDanas(templeId);
      setTempleDanas(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch temple danas",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredDanas = templeDanas.filter(templeDana =>
    templeDana.dana.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    templeDana.dana.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTimeColor = (time: string) => {
    switch (time) {
      case "MORNING": return "bg-yellow-100 text-yellow-800";
      case "AFTERNOON": return "bg-orange-100 text-orange-800";
      case "EVENING": return "bg-purple-100 text-purple-800";
      case "NIGHT": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Dana Management</h2>
          <p className="text-gray-600 mt-1">Manage dana types and schedules</p>
        </div>
        <Button 
          className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-sm sm:text-base px-4 py-2 h-10 sm:h-auto"
          onClick={() => setAddDialogOpen(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Dana Type
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search dana types..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Loading dana types...</p>
            </div>
          ) : filteredDanas.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No dana types found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredDanas.map((templeDana) => (
                <Card key={templeDana.dana.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-base sm:text-lg text-red-800 flex items-center">
                        <Heart className="h-4 w-4 mr-2" />
                        {templeDana.dana.name}
                      </CardTitle>
                      <Badge className={`${getTimeColor(templeDana.dana.time)} text-xs`}>
                        <Clock className="h-3 w-3 mr-1" />
                        {templeDana.dana.time}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-xs sm:text-sm text-gray-500">Description</p>
                      <p className="text-xs sm:text-sm font-medium">{templeDana.dana.description}</p>
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-gray-500">Minimum Families Required</p>
                      <p className="text-xs sm:text-sm font-medium">{templeDana.minNumberOfFamilies}</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 pt-2">
                      <Button size="sm" variant="outline" className="flex-1 text-xs sm:text-sm px-3 py-2 h-8 sm:h-9">
                        <Edit className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                        Edit
                      </Button>
                      <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700 text-xs sm:text-sm px-3 py-2 h-8 sm:h-9">
                        <Trash className="h-3 w-3 sm:h-4 sm:w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <AddDanaDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onSuccess={fetchTempleDanas}
      />
    </div>
  );
};
