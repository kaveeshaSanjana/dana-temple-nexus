
import { useState } from "react";
import { Search, Calendar, Users, Building, Heart, Clock, CheckCircle, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { assignmentService } from "@/services/assignmentService";
import { TempleDanaAssignment } from "@/types/assignment";
import { useToast } from "@/hooks/use-toast";

type SearchType = 'family' | 'date' | 'member' | null;

export const AssignmentManagement = () => {
  const [searchType, setSearchType] = useState<SearchType>(null);
  const [assignments, setAssignments] = useState<TempleDanaAssignment[]>([]);
  const [loading, setLoading] = useState(false);
  const [familyId, setFamilyId] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const { toast } = useToast();

  const getTimeColor = (time: string) => {
    switch (time) {
      case "MORNING": return "bg-yellow-100 text-yellow-800";
      case "AFTERNOON": return "bg-orange-100 text-orange-800";
      case "EVENING": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const handleSearchByFamily = async () => {
    if (!familyId.trim()) {
      toast({
        title: "Error",
        description: "Please enter a family ID",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const data = await assignmentService.getAssignmentsByFamily(parseInt(familyId));
      setAssignments(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch assignments by family",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearchByDate = async () => {
    if (!selectedDate) {
      toast({
        title: "Error",
        description: "Please select a date",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const data = await assignmentService.getAssignmentsByDate(selectedDate);
      setAssignments(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch assignments by date",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearchByMember = async () => {
    if (!phoneNumber.trim()) {
      toast({
        title: "Error",
        description: "Please enter a phone number",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const data = await assignmentService.getAssignmentsByMember(phoneNumber);
      setAssignments(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch assignments by member",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetSearch = () => {
    setSearchType(null);
    setAssignments([]);
    setFamilyId("");
    setSelectedDate("");
    setPhoneNumber("");
  };

  const renderSearchForm = () => {
    switch (searchType) {
      case 'family':
        return (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-purple-600" />
                Search by Family
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 items-end">
                <div className="flex-1">
                  <Label htmlFor="familyId">Family ID</Label>
                  <Input
                    id="familyId"
                    placeholder="Enter family ID"
                    value={familyId}
                    onChange={(e) => setFamilyId(e.target.value)}
                  />
                </div>
                <Button onClick={handleSearchByFamily} disabled={loading}>
                  {loading ? "Searching..." : "Search"}
                </Button>
                <Button variant="outline" onClick={resetSearch}>
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      case 'date':
        return (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                Search by Date
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 items-end">
                <div className="flex-1">
                  <Label htmlFor="selectedDate">Dana Date</Label>
                  <Input
                    id="selectedDate"
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                  />
                </div>
                <Button onClick={handleSearchByDate} disabled={loading}>
                  {loading ? "Searching..." : "Search"}
                </Button>
                <Button variant="outline" onClick={resetSearch}>
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      case 'member':
        return (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-green-600" />
                Search by Member
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 items-end">
                <div className="flex-1">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    placeholder="Enter phone number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </div>
                <Button onClick={handleSearchByMember} disabled={loading}>
                  {loading ? "Searching..." : "Search"}
                </Button>
                <Button variant="outline" onClick={resetSearch}>
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  const renderAssignmentCard = (assignment: TempleDanaAssignment) => (
    <Card key={assignment.id} className="mb-4">
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Temple Information */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Building className="h-4 w-4 text-orange-600" />
              <h3 className="font-semibold text-lg">{assignment.templeDana.templeId.name}</h3>
            </div>
            <p className="text-sm text-gray-600">{assignment.templeDana.templeId.address}</p>
            <p className="text-sm text-gray-500">{assignment.templeDana.templeId.contactNumber}</p>
            <p className="text-sm text-gray-500">{assignment.templeDana.templeId.email}</p>
          </div>

          {/* Dana Information */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Heart className="h-4 w-4 text-red-600" />
              <h3 className="font-semibold text-lg">{assignment.templeDana.dana.name}</h3>
            </div>
            <p className="text-sm text-gray-600">{assignment.templeDana.dana.description}</p>
            <Badge className={`${getTimeColor(assignment.templeDana.dana.time)} text-xs w-fit`}>
              {assignment.templeDana.dana.time}
            </Badge>
            <p className="text-sm text-gray-500">
              Min Families: {assignment.templeDana.minNumberOfFamilies}
            </p>
          </div>

          {/* Assignment Information */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-purple-600" />
              <h3 className="font-semibold text-lg">{assignment.family.familyName}</h3>
            </div>
            <p className="text-sm text-gray-600">{assignment.family.address}</p>
            <p className="text-sm text-gray-500">{assignment.family.telephone}</p>
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-gray-400" />
              <span className="text-sm">{new Date(assignment.date).toLocaleDateString()}</span>
            </div>
            <Badge 
              variant={assignment.isConfirmed ? "default" : "secondary"}
              className={`${assignment.isConfirmed ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"} w-fit`}
            >
              {assignment.isConfirmed ? (
                <>
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Confirmed
                </>
              ) : (
                <>
                  <Clock className="h-3 w-3 mr-1" />
                  Pending
                </>
              )}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Assignment Management</h2>
          <p className="text-gray-600 mt-1">Search and manage dana assignments</p>
        </div>
      </div>

      {!searchType && (
        <Card>
          <CardHeader>
            <CardTitle>Select Search Type</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                onClick={() => setSearchType('family')}
                className="h-20 flex flex-col items-center gap-2"
                variant="outline"
              >
                <Users className="h-6 w-6" />
                Search by Family
              </Button>
              <Button
                onClick={() => setSearchType('date')}
                className="h-20 flex flex-col items-center gap-2"
                variant="outline"
              >
                <Calendar className="h-6 w-6" />
                Search by Date
              </Button>
              <Button
                onClick={() => setSearchType('member')}
                className="h-20 flex flex-col items-center gap-2"
                variant="outline"
              >
                <Phone className="h-6 w-6" />
                Search by Member
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {renderSearchForm()}

      {assignments.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold mb-4">
            Assignment Results ({assignments.length})
          </h3>
          {assignments.map(renderAssignmentCard)}
        </div>
      )}

      {searchType && assignments.length === 0 && !loading && (
        <Card>
          <CardContent className="p-6 text-center">
            <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No assignments found. Try searching with different criteria.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
