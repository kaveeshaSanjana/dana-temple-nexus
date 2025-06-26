import { useState, useEffect } from "react";
import { Plus, Search, Users, Phone, Calendar, Mail, MapPin, User, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { MemberService } from "@/services/memberService";
import { Member } from "@/types/member";
import { useToast } from "@/hooks/use-toast";
import { danaService, TempleDana } from "@/services/danaService";

interface Village {
  id: number;
  villageName: string;
  templeId: number;
}

interface TempleVillage {
  templeId: number | null;
  village: {
    id: number;
    name: string;
    province: string;
    district: string;
    country: string;
    postalCode: string;
  };
  villageFamilies: any[];
}

interface FamilyMemberForm {
  name: string;
  nic?: string;
  dob?: string;
  phoneNumber: string;
  address: string;
  email: string;
  tempId: string;
}

interface DanaAssignment {
  danaId: number;
  date: string;
  tempId: string;
}

interface FamilyWithMembersRequest {
  villageId: number;
  family: {
    name: string;
    phoneNumber: string;
    address: string;
  };
  members: {
    name: string;
    nic?: string;
    dob?: string;
    address: string;
    email: string;
    phoneNumber: string;
  }[];
  danaAssignments?: {
    danaId: number;
    date: string;
  }[];
}

export const MemberManagement = () => {
  const [member, setMember] = useState<Member | null>(null);
  const [villages, setVillages] = useState<Village[]>([]);
  const [templeDanas, setTempleDanas] = useState<TempleDana[]>([]);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [familyMembers, setFamilyMembers] = useState<FamilyMemberForm[]>([]);
  const [danaAssignments, setDanaAssignments] = useState<DanaAssignment[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const { toast } = useToast();

  const familyWithMembersForm = useForm<{
    villageId: number;
    familyName: string;
    address: string;
    phoneNumber: string;
  }>();

  // Initialize with one member form
  useEffect(() => {
    setFamilyMembers([{ tempId: '1', name: '', phoneNumber: '', address: '', email: '' }]);
    loadVillages();
    loadTempleDanas();
  }, []);

  const getTempleIdFromToken = () => {
    const authToken = localStorage.getItem('authToken');
    if (authToken) {
      try {
        const payload = JSON.parse(atob(authToken.split('.')[1]));
        return payload.templeId;
      } catch (error) {
        console.error('Error parsing auth token:', error);
      }
    }
    return null;
  };

  const loadVillages = async () => {
    try {
      const templeId = getTempleIdFromToken();
      if (!templeId) {
        console.error('No temple ID found in token');
        return;
      }

      const response = await fetch(`http://localhost:8081/api/temple-village/by-temple/${templeId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch villages');
      }

      const data: TempleVillage[] = await response.json();
      const villageList: Village[] = data.map(tv => ({
        id: tv.village.id,
        villageName: tv.village.name,
        templeId: templeId
      }));
      
      setVillages(villageList);
    } catch (error) {
      console.error('Failed to load villages:', error);
      toast({
        title: "Error",
        description: "Failed to load villages",
        variant: "destructive",
      });
    }
  };

  const loadTempleDanas = async () => {
    try {
      const templeId = getTempleIdFromToken();
      if (!templeId) {
        console.error('No temple ID found in token');
        return;
      }

      const data = await danaService.getTempleDanas(templeId);
      setTempleDanas(data);
    } catch (error) {
      console.error('Failed to load temple danas:', error);
      toast({
        title: "Error",
        description: "Failed to load dana types",
        variant: "destructive",
      });
    }
  };

  const searchMemberByPhone = async () => {
    if (!phoneNumber.trim()) return;
    
    try {
      setSearchLoading(true);
      const data = await MemberService.getMemberByPhone(phoneNumber);
      setMember(data);
    } catch (error) {
      console.error('Failed to search member:', error);
      setMember(null);
    } finally {
      setSearchLoading(false);
    }
  };

  const handlePhoneSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchMemberByPhone();
  };

  const addFamilyMemberForm = () => {
    const newId = (familyMembers.length + 1).toString();
    setFamilyMembers([...familyMembers, { 
      tempId: newId, 
      name: '', 
      phoneNumber: '', 
      address: '',
      email: ''
    }]);
  };

  const removeFamilyMemberForm = (tempId: string) => {
    setFamilyMembers(familyMembers.filter(form => form.tempId !== tempId));
  };

  const updateFamilyMemberForm = (tempId: string, field: keyof FamilyMemberForm, value: string) => {
    setFamilyMembers(familyMembers.map(form => 
      form.tempId === tempId ? { ...form, [field]: value } : form
    ));
  };

  const addDanaAssignment = () => {
    const newId = (danaAssignments.length + 1).toString();
    setDanaAssignments([...danaAssignments, {
      tempId: newId,
      danaId: 0,
      date: ''
    }]);
  };

  const removeDanaAssignment = (tempId: string) => {
    setDanaAssignments(danaAssignments.filter(assignment => assignment.tempId !== tempId));
  };

  const updateDanaAssignment = (tempId: string, field: keyof DanaAssignment, value: string | number) => {
    setDanaAssignments(danaAssignments.map(assignment => 
      assignment.tempId === tempId ? { ...assignment, [field]: value } : assignment
    ));
  };

  const handleCreateFamilyWithMembers = async (familyData: { villageId: number; familyName: string; address: string; phoneNumber: string }) => {
    try {
      setLoading(true);
      const validMembers = familyMembers.filter(member => member.name && member.phoneNumber && member.email);
      
      if (validMembers.length === 0) {
        toast({
          title: "Error",
          description: "Please add at least one valid member",
          variant: "destructive",
        });
        return;
      }

      if (!familyData.villageId) {
        toast({
          title: "Error",
          description: "Please select a village",
          variant: "destructive",
        });
        return;
      }

      const validDanaAssignments = danaAssignments.filter(assignment => 
        assignment.danaId && assignment.date
      );

      const familyWithMembers: FamilyWithMembersRequest = {
        villageId: familyData.villageId,
        family: {
          name: familyData.familyName,
          phoneNumber: familyData.phoneNumber,
          address: familyData.address,
        },
        members: validMembers.map(member => ({
          name: member.name,
          phoneNumber: member.phoneNumber,
          address: member.address,
          email: member.email,
          ...(member.nic && { nic: member.nic }),
          ...(member.dob && { dob: member.dob }),
        }))
      };

      if (validDanaAssignments.length > 0) {
        familyWithMembers.danaAssignments = validDanaAssignments.map(assignment => ({
          danaId: assignment.danaId,
          date: assignment.date,
        }));
      }

      const response = await fetch('http://localhost:8081/api/family/assign-members-at-once', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify(familyWithMembers),
      });

      if (!response.ok) {
        throw new Error('Failed to create family with members');
      }
      
      // Reset forms
      familyWithMembersForm.reset();
      setFamilyMembers([{ tempId: '1', name: '', phoneNumber: '', address: '', email: '' }]);
      setDanaAssignments([]);
      
      toast({
        title: "Success",
        description: "Family with members created successfully!",
      });
    } catch (error) {
      console.error('Failed to create family with members:', error);
      toast({
        title: "Error",
        description: "Failed to create family with members",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Member Management</h2>
          <p className="text-gray-600 mt-1">Manage temple members and families</p>
        </div>
      </div>

      <Tabs defaultValue="members" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="family-members">Family + Members</TabsTrigger>
        </TabsList>

        <TabsContent value="members" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Search Member by Phone Number</CardTitle>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handlePhoneSearch} className="flex gap-2 mb-4">
                <Input
                  placeholder="Enter phone number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit" disabled={searchLoading}>
                  <Search className="h-4 w-4 mr-2" />
                  {searchLoading ? "Searching..." : "Search"}
                </Button>
              </form>

              {member && (
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2 mb-3">
                      <User className="h-5 w-5 text-blue-600" />
                      <h3 className="font-semibold text-lg">{member.name}</h3>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">NIC: {member.nic}</Badge>
                      </div>
                      
                      {member.email && (
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-gray-400" />
                          <span>{member.email}</span>
                        </div>
                      )}
                      
                      {member.phoneNumber && (
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <span>{member.phoneNumber}</span>
                        </div>
                      )}
                      
                      {member.dob && (
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span>{new Date(member.dob).toLocaleDateString()}</span>
                        </div>
                      )}
                      
                      {member.address && (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <span className="text-xs">{member.address}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {phoneNumber && !member && !searchLoading && (
                <div className="text-center py-8 text-gray-500">
                  No member found with phone number: {phoneNumber}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="family-members" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Create Family with Members At Once</CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <Form {...familyWithMembersForm}>
                <form onSubmit={familyWithMembersForm.handleSubmit(handleCreateFamilyWithMembers)} className="space-y-6">
                  {/* Family Information Section */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <FormField
                      control={familyWithMembersForm.control}
                      name="villageId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-gray-700">Village *</FormLabel>
                          <Select onValueChange={(value) => field.onChange(parseInt(value))} value={field.value?.toString()}>
                            <FormControl>
                              <SelectTrigger className="h-10">
                                <SelectValue placeholder="Select a village" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {villages.map((village) => (
                                <SelectItem key={village.id} value={village.id.toString()}>
                                  {village.villageName}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={familyWithMembersForm.control}
                      name="familyName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-gray-700">Family Name *</FormLabel>
                          <FormControl>
                            <Input placeholder="Family name" className="h-10" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={familyWithMembersForm.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-gray-700">Family Address *</FormLabel>
                          <FormControl>
                            <Input placeholder="Family address" className="h-10" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={familyWithMembersForm.control}
                      name="phoneNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-gray-700">Phone Number *</FormLabel>
                          <FormControl>
                            <Input placeholder="Family contact number" className="h-10" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Family Members Section */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium text-lg text-gray-900">Family Members</h4>
                      <Button 
                        type="button" 
                        onClick={addFamilyMemberForm} 
                        variant="outline"
                        className="bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Member
                      </Button>
                    </div>

                    {familyMembers.map((member, index) => (
                      <div key={member.tempId} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                        <div className="flex justify-between items-center mb-4">
                          <h5 className="font-medium text-gray-900">Member {index + 1}</h5>
                          {familyMembers.length > 1 && (
                            <Button 
                              type="button"
                              onClick={() => removeFamilyMemberForm(member.tempId)}
                              variant="outline"
                              size="sm"
                              className="text-red-600 border-red-200 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium text-gray-700 mb-1 block">Full Name *</label>
                            <Input
                              value={member.name}
                              onChange={(e) => updateFamilyMemberForm(member.tempId, 'name', e.target.value)}
                              placeholder="Full name"
                              className="h-10"
                            />
                          </div>
                          
                          <div>
                            <label className="text-sm font-medium text-gray-700 mb-1 block">Email *</label>
                            <Input
                              value={member.email}
                              onChange={(e) => updateFamilyMemberForm(member.tempId, 'email', e.target.value)}
                              placeholder="Email address"
                              type="email"
                              className="h-10"
                            />
                          </div>
                          
                          <div>
                            <label className="text-sm font-medium text-gray-700 mb-1 block">Phone Number *</label>
                            <Input
                              value={member.phoneNumber}
                              onChange={(e) => updateFamilyMemberForm(member.tempId, 'phoneNumber', e.target.value)}
                              placeholder="Phone number"
                              className="h-10"
                            />
                          </div>
                          
                          <div>
                            <label className="text-sm font-medium text-gray-700 mb-1 block">Address *</label>
                            <Input
                              value={member.address}
                              onChange={(e) => updateFamilyMemberForm(member.tempId, 'address', e.target.value)}
                              placeholder="Member address"
                              className="h-10"
                            />
                          </div>

                          <div>
                            <label className="text-sm font-medium text-gray-700 mb-1 block">NIC Number</label>
                            <Input
                              value={member.nic || ''}
                              onChange={(e) => updateFamilyMemberForm(member.tempId, 'nic', e.target.value)}
                              placeholder="NIC number (optional)"
                              className="h-10"
                            />
                          </div>

                          <div>
                            <label className="text-sm font-medium text-gray-700 mb-1 block">Date of Birth</label>
                            <Input
                              type="date"
                              value={member.dob || ''}
                              onChange={(e) => updateFamilyMemberForm(member.tempId, 'dob', e.target.value)}
                              className="h-10"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Dana Assignments Section */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium text-lg text-gray-900">Dana Assignments</h4>
                      <Button 
                        type="button" 
                        onClick={addDanaAssignment} 
                        variant="outline"
                        className="bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-100"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Dana Assignment
                      </Button>
                    </div>

                    {danaAssignments.map((assignment, index) => (
                      <div key={assignment.tempId} className="border border-gray-200 rounded-lg p-4 bg-orange-50">
                        <div className="flex justify-between items-center mb-4">
                          <h5 className="font-medium text-gray-900">Dana Assignment {index + 1}</h5>
                          <Button 
                            type="button"
                            onClick={() => removeDanaAssignment(assignment.tempId)}
                            variant="outline"
                            size="sm"
                            className="text-red-600 border-red-200 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium text-gray-700 mb-1 block">Dana Type *</label>
                            <Select onValueChange={(value) => updateDanaAssignment(assignment.tempId, 'danaId', parseInt(value))}>
                              <SelectTrigger className="h-10">
                                <SelectValue placeholder="Select dana type" />
                              </SelectTrigger>
                              <SelectContent>
                                {templeDanas.map((templeDana) => (
                                  <SelectItem key={templeDana.dana.id} value={templeDana.dana.id.toString()}>
                                    {templeDana.dana.name} ({templeDana.dana.time})
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div>
                            <label className="text-sm font-medium text-gray-700 mb-1 block">Date *</label>
                            <Input
                              type="date"
                              value={assignment.date}
                              onChange={(e) => updateDanaAssignment(assignment.tempId, 'date', e.target.value)}
                              className="h-10"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex justify-end">
                    <Button 
                      type="submit" 
                      disabled={loading}
                      className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-2"
                    >
                      {loading ? "Creating..." : "Create Family with Members"}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
