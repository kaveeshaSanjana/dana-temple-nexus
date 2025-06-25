
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Mail, Phone, MapPin, Edit2, Save, X, Calendar, CreditCard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { MemberService } from "@/services/memberService";
import { Member } from "@/types/member";

interface UserData {
  name: string;
  email: string;
  phone: string;
  address: string;
  role: string;
  joinDate: string;
  templeAssigned: string;
}

export const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const userRole = localStorage.getItem("userRole") || "member";
  const userId = localStorage.getItem("userId");

  // State for member data
  const [memberData, setMemberData] = useState<Member | null>(null);
  const [editMemberData, setEditMemberData] = useState<Member | null>(null);

  // Mock user data for non-member roles
  const [userData, setUserData] = useState<UserData>({
    name: "John Doe",
    email: "john.doe@email.com",
    phone: "+94 77 123 4567",
    address: "123 Temple Street, Colombo 07",
    role: userRole,
    joinDate: "January 2024",
    templeAssigned: "Sri Dharma Temple"
  });

  const [editUserData, setEditUserData] = useState<UserData | null>(null);

  useEffect(() => {
    if (userRole === "member" && userId) {
      fetchMemberData();
    } else {
      setLoading(false);
    }
  }, [userRole, userId]);

  const fetchMemberData = async () => {
    try {
      if (!userId) return;
      
      const data = await MemberService.getMemberById(parseInt(userId));
      setMemberData(data);
      setEditMemberData(data);
    } catch (error) {
      console.error('Error fetching member data:', error);
      toast({
        title: "Error",
        description: "Failed to load profile data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (userRole === "member" && editMemberData && memberData) {
      try {
        const updatedMember = await MemberService.updateMember(memberData.id!, editMemberData);
        setMemberData(updatedMember);
        setIsEditing(false);
        toast({
          title: "Profile Updated",
          description: "Your profile has been successfully updated.",
        });
      } catch (error) {
        console.error('Error updating member data:', error);
        toast({
          title: "Error",
          description: "Failed to update profile",
          variant: "destructive",
        });
      }
    } else {
      // Mock update for non-member roles
      if (editUserData) {
        setUserData(editUserData);
      }
      setIsEditing(false);
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
    }
  };

  const handleCancel = () => {
    if (userRole === "member" && memberData) {
      setEditMemberData(memberData);
    } else {
      setEditUserData(userData);
    }
    setIsEditing(false);
  };

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case "admin": return "Administrator";
      case "headmonk": return "Head Monk";
      case "helper": return "Helper";
      case "member": return "Member";
      default: return "Member";
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading profile...</div>
      </div>
    );
  }

  const displayName = userRole === "member" ? memberData?.name : userData.name;

  if (userRole === "member" && !memberData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Unable to load profile data</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Profile</h2>
          <p className="text-gray-600 mt-1">Manage your personal information</p>
        </div>
        {!isEditing && (
          <Button onClick={() => {
            setIsEditing(true);
            if (userRole !== "member") {
              setEditUserData(userData);
            }
          }} variant="outline">
            <Edit2 className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        )}
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src="" alt={displayName || ""} />
              <AvatarFallback className="text-lg font-semibold bg-orange-100 text-orange-800">
                {getInitials(displayName || "U")}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl">{displayName}</CardTitle>
              <p className="text-orange-600 font-medium">{getRoleDisplayName(userRole)}</p>
              {userRole !== "member" && (
                <p className="text-sm text-gray-500">Member since {userData.joinDate}</p>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {isEditing ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={userRole === "member" ? editMemberData?.name || "" : editUserData?.name || ""}
                    onChange={(e) => {
                      if (userRole === "member") {
                        setEditMemberData(prev => prev ? { ...prev, name: e.target.value } : null);
                      } else {
                        setEditUserData(prev => prev ? { ...prev, name: e.target.value } : null);
                      }
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={userRole === "member" ? editMemberData?.email || "" : editUserData?.email || ""}
                    onChange={(e) => {
                      if (userRole === "member") {
                        setEditMemberData(prev => prev ? { ...prev, email: e.target.value } : null);
                      } else {
                        setEditUserData(prev => prev ? { ...prev, email: e.target.value } : null);
                      }
                    }}
                  />
                </div>
                {userRole === "member" && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="nic">NIC Number</Label>
                      <Input
                        id="nic"
                        value={editMemberData?.nic || ""}
                        onChange={(e) => setEditMemberData(prev => prev ? { ...prev, nic: e.target.value } : null)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dob">Date of Birth</Label>
                      <Input
                        id="dob"
                        type="date"
                        value={editMemberData?.dob || ""}
                        onChange={(e) => setEditMemberData(prev => prev ? { ...prev, dob: e.target.value } : null)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number (Read-only)</Label>
                      <Input
                        id="phone"
                        value={editMemberData?.phoneNumber || ""}
                        disabled
                        className="bg-gray-100"
                      />
                    </div>
                  </>
                )}
                {userRole !== "member" && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={editUserData?.phone || ""}
                        onChange={(e) => setEditUserData(prev => prev ? { ...prev, phone: e.target.value } : null)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="temple">Assigned Temple</Label>
                      <Input
                        id="temple"
                        value={editUserData?.templeAssigned || ""}
                        onChange={(e) => setEditUserData(prev => prev ? { ...prev, templeAssigned: e.target.value } : null)}
                      />
                    </div>
                  </>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={userRole === "member" ? editMemberData?.address || "" : editUserData?.address || ""}
                  onChange={(e) => {
                    if (userRole === "member") {
                      setEditMemberData(prev => prev ? { ...prev, address: e.target.value } : null);
                    } else {
                      setEditUserData(prev => prev ? { ...prev, address: e.target.value } : null);
                    }
                  }}
                />
              </div>
              <div className="flex space-x-2 pt-4">
                <Button onClick={handleSave}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
                <Button variant="outline" onClick={handleCancel}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <User className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Full Name</p>
                    <p className="text-gray-900">{displayName}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Email Address</p>
                    <p className="text-gray-900">{userRole === "member" ? memberData?.email : userData.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Phone Number</p>
                    <p className="text-gray-900">{userRole === "member" ? memberData?.phoneNumber : userData.phone}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Address</p>
                    <p className="text-gray-900">{userRole === "member" ? memberData?.address : userData.address}</p>
                  </div>
                </div>
                {userRole === "member" && memberData && (
                  <>
                    <div className="flex items-center space-x-3">
                      <CreditCard className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">NIC Number</p>
                        <p className="text-gray-900">{memberData.nic}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Date of Birth</p>
                        <p className="text-gray-900">{new Date(memberData.dob).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </>
                )}
                {userRole !== "member" && (
                  <div className="p-4 bg-orange-50 rounded-lg">
                    <p className="text-sm font-medium text-orange-800">Assigned Temple</p>
                    <p className="text-orange-700">{userData.templeAssigned}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
