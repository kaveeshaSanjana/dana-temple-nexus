
import { useState, useEffect } from "react";
import { Plus, Search, Edit, User, Phone, Mail, Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AddEditHelperDialog } from "@/components/dialogs/AddEditHelperDialog";
import { helperService, HelperDTO } from "@/services/helperService";
import { useToast } from "@/hooks/use-toast";

export const HelperManagement = () => {
  const [helpers, setHelpers] = useState<HelperDTO[]>([]);
  const [filteredHelpers, setFilteredHelpers] = useState<HelperDTO[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedHelper, setSelectedHelper] = useState<HelperDTO | undefined>();
  const [dialogMode, setDialogMode] = useState<'add' | 'edit'>('add');
  const { toast } = useToast();

  useEffect(() => {
    fetchHelpers();
  }, []);

  useEffect(() => {
    const filtered = helpers.filter(helper =>
      helper.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      helper.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      helper.phoneNumber.includes(searchTerm)
    );
    setFilteredHelpers(filtered);
  }, [helpers, searchTerm]);

  const fetchHelpers = async () => {
    setLoading(true);
    try {
      const data = await helperService.getAllHelpers();
      setHelpers(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch helpers",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddHelper = () => {
    setSelectedHelper(undefined);
    setDialogMode('add');
    setDialogOpen(true);
  };

  const handleEditHelper = (helper: HelperDTO) => {
    setSelectedHelper(helper);
    setDialogMode('edit');
    setDialogOpen(true);
  };

  const handleDialogSuccess = () => {
    fetchHelpers();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading helpers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Helper Management</h2>
          <p className="text-gray-600 mt-1">Manage temple helpers and volunteers</p>
        </div>
        <Button 
          onClick={handleAddHelper}
          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-sm sm:text-base px-4 py-2 h-10 sm:h-auto"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Helper
        </Button>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search helpers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {filteredHelpers.length === 0 ? (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No helpers found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm ? "No helpers match your search criteria." : "Get started by adding your first helper."}
              </p>
              {!searchTerm && (
                <Button onClick={handleAddHelper}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Helper
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHelpers.map((helper) => (
            <Card key={helper.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <User className="h-5 w-5 text-blue-600" />
                    <span className="text-lg font-semibold truncate">{helper.name}</span>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEditHelper(helper)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-sm">
                    <Mail className="h-4 w-4 text-gray-500 flex-shrink-0" />
                    <span className="text-gray-700 truncate">{helper.email}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-sm">
                    <Phone className="h-4 w-4 text-gray-500 flex-shrink-0" />
                    <span className="text-gray-700">{helper.phoneNumber}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-sm">
                    <Building className="h-4 w-4 text-gray-500 flex-shrink-0" />
                    <span className="text-gray-700">Temple ID: {helper.templeId}</span>
                  </div>
                  
                  <div className="pt-2">
                    <Badge className="bg-green-100 text-green-800 text-xs">
                      Active
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AddEditHelperDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSuccess={handleDialogSuccess}
        helper={selectedHelper}
        mode={dialogMode}
      />
    </div>
  );
};
