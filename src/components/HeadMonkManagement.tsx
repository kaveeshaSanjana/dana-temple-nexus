
import { useState } from "react";
import { Plus, Search, Edit, Trash2, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface HeadMonk {
  id: number;
  name: string;
  email: string;
  phone: string;
  temple: string;
  ordinationDate: string;
  experience: number;
  status: "Active" | "Inactive";
}

export const HeadMonkManagement = () => {
  const [headMonks, setHeadMonks] = useState<HeadMonk[]>([
    {
      id: 1,
      name: "Ven. Dhammika Thero",
      email: "dhammika.thero@temple.lk",
      phone: "+94 77 111 2222",
      temple: "Sri Maha Bodhi Temple",
      ordinationDate: "2010-05-15",
      experience: 14,
      status: "Active"
    },
    {
      id: 2,
      name: "Ven. Sobhitha Thero",
      email: "sobhitha.thero@temple.lk",
      phone: "+94 77 333 4444",
      temple: "Temple of Peace",
      ordinationDate: "2008-03-20",
      experience: 16,
      status: "Active"
    }
  ]);
  
  const [searchTerm, setSearchTerm] = useState("");

  const filteredHeadMonks = headMonks.filter(monk =>
    monk.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    monk.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    monk.temple.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id: number) => {
    setHeadMonks(prev => prev.filter(monk => monk.id !== id));
  };

  const getStatusColor = (status: string) => {
    return status === "Active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Head Monk Management</h2>
          <p className="text-gray-600 mt-1">Manage temple head monks and senior clergy</p>
        </div>
        <Button className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-sm sm:text-base px-4 py-2 h-10 sm:h-auto">
          <Plus className="h-4 w-4 mr-2" />
          Add Head Monk
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search head monks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Temple</TableHead>
                  <TableHead>Ordination Date</TableHead>
                  <TableHead>Experience</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredHeadMonks.map((monk) => (
                  <TableRow key={monk.id}>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Crown className="h-4 w-4 text-purple-600" />
                        <span className="font-medium">{monk.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{monk.email}</TableCell>
                    <TableCell>{monk.phone}</TableCell>
                    <TableCell>{monk.temple}</TableCell>
                    <TableCell>{new Date(monk.ordinationDate).toLocaleDateString()}</TableCell>
                    <TableCell>{monk.experience} years</TableCell>
                    <TableCell>
                      <Badge className={`${getStatusColor(monk.status)} text-xs`}>
                        {monk.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <Edit className="h-3 w-3" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Head Monk</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete {monk.name}? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => handleDelete(monk.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
