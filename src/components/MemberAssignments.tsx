import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar, MapPin, Clock, CheckCircle, Check, Phone, Users, Home } from "lucide-react";
import { AuthService } from "@/services/authService";
import { API_CONFIG } from "@/config/api";
import { TempleDanaAssignment } from "@/types/assignment";
import { useToast } from "@/hooks/use-toast";

export const MemberAssignments = () => {
  const [assignments, setAssignments] = useState<TempleDanaAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.TEMPLE_DANA_ASSIGNMENTS}`, {
        headers: {
          ...AuthService.getAuthHeaders(),
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch assignments');
      }

      const data = await response.json();
      setAssignments(data);
    } catch (error) {
      console.error('Error fetching assignments:', error);
      toast({
        title: "Error",
        description: "Failed to load assignments",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (isConfirmed: boolean | null) => {
    if (isConfirmed === true) return "bg-green-100 text-green-800 border-green-200";
    return "bg-yellow-100 text-yellow-800 border-yellow-200";
  };

  const getStatusText = (isConfirmed: boolean | null) => {
    if (isConfirmed === true) return "confirmed";
    return "pending";
  };

  const getTimeColor = (time: string) => {
    switch (time) {
      case "MORNING": return "bg-amber-100 text-amber-800 border-amber-200";
      case "AFTERNOON": return "bg-orange-100 text-orange-800 border-orange-200";
      case "EVENING": return "bg-purple-100 text-purple-800 border-purple-200";
      case "NIGHT": return "bg-indigo-100 text-indigo-800 border-indigo-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const isTomorrow = (dateString: string) => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const assignmentDate = new Date(dateString);
    return assignmentDate.toDateString() === tomorrow.toDateString();
  };

  const handleConfirmAssignment = async (id: number) => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CONFIRM_ASSIGNMENT}/${id}`, {
        method: 'POST',
        headers: {
          ...AuthService.getAuthHeaders(),
        },
      });

      if (!response.ok) {
        throw new Error('Failed to confirm assignment');
      }

      setAssignments(prev => prev.map(assignment => 
        assignment.id === id 
          ? { ...assignment, isConfirmed: true }
          : assignment
      ));

      toast({
        title: "Success",
        description: "Assignment confirmed successfully",
      });
    } catch (error) {
      console.error('Error confirming assignment:', error);
      toast({
        title: "Error",
        description: "Failed to confirm assignment",
        variant: "destructive",
      });
    }
  };

  const handleCallTemple = (phoneNumber: string) => {
    window.open(`tel:${phoneNumber}`, '_self');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-lg text-gray-600">Loading assignments...</div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col">
      <div className="flex-shrink-0 mb-6">
        <h2 className="text-3xl font-bold text-gray-900">My Dana Assignments</h2>
        <p className="text-gray-600 mt-1">View your upcoming and completed dana assignments</p>
      </div>

      <ScrollArea className="flex-1 pr-4">
        <div className="space-y-6 pb-6">
          {assignments.map((assignment) => (
            <Card key={assignment.id} className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-orange-400">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-xl text-orange-800 mb-2">
                      {assignment.templeDana.templeId.name}
                    </CardTitle>
                    <div className="flex items-center text-sm text-gray-600 mb-1">
                      <MapPin className="h-4 w-4 mr-2" />
                      {assignment.templeDana.templeId.address}
                    </div>
                  </div>
                  <div className="flex flex-col space-y-2">
                    <Badge className={`${getStatusColor(assignment.isConfirmed)} border font-medium`}>
                      {assignment.isConfirmed === true && <CheckCircle className="h-3 w-3 mr-1" />}
                      {getStatusText(assignment.isConfirmed)}
                    </Badge>
                    <Badge className={`${getTimeColor(assignment.templeDana.dana.time)} border font-medium`}>
                      <Clock className="h-3 w-3 mr-1" />
                      {assignment.templeDana.dana.time}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Dana Information */}
                <div className="bg-orange-50 p-4 rounded-lg border border-orange-100">
                  <h4 className="font-semibold text-orange-800 mb-2 flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Dana Details
                  </h4>
                  <p className="text-lg font-medium text-gray-900 mb-1">{assignment.templeDana.dana.name}</p>
                  <p className="text-sm text-gray-600 mb-2">{assignment.templeDana.dana.description}</p>
                  <p className="text-xs text-gray-500">
                    Minimum Families Required: {assignment.templeDana.minNumberOfFamilies}
                  </p>
                </div>

                {/* All Assigned Families */}
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <h4 className="font-semibold text-blue-800 mb-3 flex items-center">
                    <Users className="h-4 w-4 mr-2" />
                    Assigned Families ({assignment.templeDana.assignments.length})
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {assignment.templeDana.assignments.map((familyAssignment) => (
                      <div key={familyAssignment.id} className="bg-white p-3 rounded-md border border-blue-200">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{familyAssignment.family.familyName}</p>
                            <div className="flex items-center text-xs text-gray-600 mt-1">
                              <Home className="h-3 w-3 mr-1" />
                              {familyAssignment.family.address}
                            </div>
                            <div className="flex items-center text-xs text-gray-600 mt-1">
                              <Phone className="h-3 w-3 mr-1" />
                              {familyAssignment.family.telephone}
                            </div>
                          </div>
                          <Badge 
                            className={`${getStatusColor(familyAssignment.isConfirmed)} text-xs border px-2 py-0.5`}
                          >
                            {getStatusText(familyAssignment.isConfirmed)}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Assignment Date and Actions */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-md">
                      <Calendar className="h-4 w-4 mr-2" />
                      {new Date(assignment.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                    <Button 
                      onClick={() => handleCallTemple(assignment.templeDana.templeId.contactNumber)}
                      variant="outline"
                      size="sm"
                      className="w-full sm:w-auto border-blue-200 hover:bg-blue-50"
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      Call Temple
                    </Button>
                    
                    {isTomorrow(assignment.date) && assignment.isConfirmed !== true && (
                      <Button 
                        onClick={() => handleConfirmAssignment(assignment.id)}
                        className="bg-green-600 hover:bg-green-700 w-full sm:w-auto"
                        size="sm"
                      >
                        <Check className="h-4 w-4 mr-2" />
                        Confirm Tomorrow's Dana
                      </Button>
                    )}
                  </div>
                </div>

                {/* Temple Contact Information */}
                <div className="bg-gray-50 p-3 rounded-lg text-xs text-gray-600 border border-gray-200">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <p><span className="font-medium">Email:</span> {assignment.templeDana.templeId.email}</p>
                    <p><span className="font-medium">Website:</span> {assignment.templeDana.templeId.website}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {assignments.length === 0 && (
            <Card className="text-center py-12">
              <CardContent>
                <div className="text-gray-500">
                  <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium mb-2">No assignments found</p>
                  <p className="text-sm">You don't have any dana assignments at the moment.</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
