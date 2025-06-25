
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Phone, Home, Users } from "lucide-react";
import { Family } from "@/types/auth";

export const MemberFamilies = () => {
  const [families, setFamilies] = useState<Family[]>([]);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const storedFamilies = localStorage.getItem("userFamilies");
    const storedUserName = localStorage.getItem("userName");
    
    if (storedFamilies) {
      setFamilies(JSON.parse(storedFamilies));
    }
    
    if (storedUserName) {
      setUserName(storedUserName);
    }
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">My Families</h2>
          <p className="text-gray-600 mt-1">
            Welcome {userName}! Here are the families you're assigned to manage.
          </p>
        </div>
        <Badge variant="secondary" className="text-sm">
          {families.length} Familie{families.length !== 1 ? 's' : ''} Assigned
        </Badge>
      </div>

      {families.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Families Assigned</h3>
            <p className="text-gray-500 text-center">
              You don't have any families assigned to you at the moment.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {families.map((family) => (
            <Card key={family.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center space-x-2">
                  <Home className="h-5 w-5 text-orange-600" />
                  <span className="text-lg">{family.familyName}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start space-x-2">
                  <Home className="h-4 w-4 text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Address</p>
                    <p className="text-sm text-gray-600">{family.address}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Telephone</p>
                    <p className="text-sm text-gray-600">{family.telephone}</p>
                  </div>
                </div>
                
                <div className="pt-2">
                  <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-200">
                    Family ID: {family.id}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
