import React, { useState, useEffect } from 'react';
import MUITable from '@/components/ui/mui-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getImageUrl } from '@/utils/imageUrlHelper';
import { RefreshCw, Filter, Eye, Edit, Trash2, Plus, BookOpen, AlertCircle, Power, PowerOff, UserPlus, UserMinus, Users } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useInstituteRole } from '@/hooks/useInstituteRole';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useParams } from 'react-router-dom';
import { instituteApi } from '@/api/institute.api';
import { TeacherAutocomplete } from '@/components/ui/teacher-autocomplete';

interface ClassSubject {
  id: string;
  subjectId: string;
  classId: string;
  instituteId: string;
  isActive: boolean;
  defaultTeacherId?: string | null;
  subject?: {
    id: string;
    code: string;
    name: string;
    category?: string;
    creditHours?: number;
    subjectType?: string;
    basketCategory?: string;
    imgUrl?: string;
    isActive: boolean;
  };
  teacher?: {
    id: string;
    firstName?: string;
    lastName?: string;
    name?: string;
    email?: string;
    imageUrl?: string;
  } | null;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Institute Subjects Management Page (Class Context)
 * 
 * After selecting a class, this page shows:
 * ✅ All subjects assigned to the selected class
 * ✅ Teachers assigned to each subject
 * ✅ Ability to assign/unassign teachers
 * ✅ Activate/Deactivate subject-class assignments
 */
const InstituteSubjects = () => {
  const { classId } = useParams();
  const {
    user,
    selectedInstitute,
    currentInstituteId,
    selectedClass
  } = useAuth();
  const { toast } = useToast();
  const userRole = useInstituteRole();
  
  // Data states
  const [classSubjects, setClassSubjects] = useState<ClassSubject[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Dialog states
  const [isAssignTeacherDialogOpen, setIsAssignTeacherDialogOpen] = useState(false);
  const [selectedSubjectForTeacher, setSelectedSubjectForTeacher] = useState<ClassSubject | null>(null);
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>('');
  const [isAssigningTeacher, setIsAssigningTeacher] = useState(false);
  
  const [showUnassignConfirm, setShowUnassignConfirm] = useState(false);
  const [subjectToUnassign, setSubjectToUnassign] = useState<ClassSubject | null>(null);
  const [isUnassigning, setIsUnassigning] = useState(false);
  
  const [showDeactivateConfirm, setShowDeactivateConfirm] = useState(false);
  const [subjectToDeactivate, setSubjectToDeactivate] = useState<ClassSubject | null>(null);
  const [isDeactivating, setIsDeactivating] = useState(false);
  
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedSubjectData, setSelectedSubjectData] = useState<ClassSubject | null>(null);
  
  // Filter states
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('active');

  // Image preview state
  const [previewImage, setPreviewImage] = useState<{ url: string; title: string } | null>(null);

  // Permission checks
  const isInstituteAdmin = userRole === 'InstituteAdmin';
  const isSuperAdmin = user?.role === 'SystemAdmin';
  const canManageTeachers = isInstituteAdmin || isSuperAdmin;
  const canDeactivate = isInstituteAdmin || isSuperAdmin;

  // Use classId from URL params or from selectedClass
  const currentClassId = classId || selectedClass?.id;

  // Fetch class subjects
  const fetchClassSubjects = async (forceRefresh = false) => {
    if (!currentInstituteId || !currentClassId) return;
    
    setIsLoading(true);
    try {
      const response = await instituteApi.getClassSubjects(
        currentInstituteId, 
        currentClassId, 
        { userId: user?.id, role: userRole || 'User' },
        forceRefresh
      );
      
      // Handle response - it may be wrapped in data property
      const subjectsData = Array.isArray(response) ? response : (response as any)?.data || [];
      setClassSubjects(subjectsData);
    } catch (error: any) {
      console.error('Error fetching class subjects:', error);
      toast({
        title: "Error",
        description: error?.message || "Failed to load class subjects",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (currentInstituteId && currentClassId) {
      fetchClassSubjects();
    }
  }, [currentInstituteId, currentClassId]);

  const resolveImageUrl = (url?: string | null) => {
    if (!url) return '/placeholder.svg';
    return getImageUrl(url);
  };

  // Filter subjects based on search and status
  const filteredSubjects = classSubjects.filter(cs => {
    const subject = cs.subject;
    const matchesSearch = !searchTerm || 
      subject?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subject?.code?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'active' && cs.isActive) ||
      (statusFilter === 'inactive' && !cs.isActive);
    
    return matchesSearch && matchesStatus;
  });

  // Assign teacher handler
  const handleAssignTeacherClick = (cs: ClassSubject) => {
    setSelectedSubjectForTeacher(cs);
    setSelectedTeacherId(cs.defaultTeacherId || '');
    setIsAssignTeacherDialogOpen(true);
  };

  const confirmAssignTeacher = async () => {
    if (!selectedSubjectForTeacher || !currentInstituteId || !currentClassId || isAssigningTeacher) return;
    
    if (!selectedTeacherId) {
      toast({
        title: "Error",
        description: "Please select a teacher",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsAssigningTeacher(true);
      await instituteApi.assignTeacherToSubject(
        currentInstituteId,
        currentClassId,
        selectedSubjectForTeacher.subjectId,
        selectedTeacherId
      );
      
      toast({
        title: "Teacher Assigned",
        description: `Teacher has been assigned to ${selectedSubjectForTeacher.subject?.name}`
      });
      
      setIsAssignTeacherDialogOpen(false);
      setSelectedSubjectForTeacher(null);
      setSelectedTeacherId('');
      fetchClassSubjects(true);
    } catch (error: any) {
      console.error('Error assigning teacher:', error);
      toast({
        title: "Assignment Failed",
        description: error?.message || "Failed to assign teacher",
        variant: "destructive"
      });
    } finally {
      setIsAssigningTeacher(false);
    }
  };

  // Unassign teacher handler
  const handleUnassignTeacherClick = (cs: ClassSubject) => {
    setSubjectToUnassign(cs);
    setShowUnassignConfirm(true);
  };

  const confirmUnassignTeacher = async () => {
    if (!subjectToUnassign || !currentInstituteId || !currentClassId || isUnassigning) return;

    try {
      setIsUnassigning(true);
      await instituteApi.unassignTeacherFromSubject(
        currentInstituteId,
        currentClassId,
        subjectToUnassign.subjectId
      );
      
      toast({
        title: "Teacher Unassigned",
        description: `Teacher has been removed from ${subjectToUnassign.subject?.name}`
      });
      
      setShowUnassignConfirm(false);
      setSubjectToUnassign(null);
      fetchClassSubjects(true);
    } catch (error: any) {
      console.error('Error unassigning teacher:', error);
      toast({
        title: "Unassignment Failed",
        description: error?.message || "Failed to unassign teacher",
        variant: "destructive"
      });
    } finally {
      setIsUnassigning(false);
    }
  };

  // View subject details
  const handleViewSubject = (cs: ClassSubject) => {
    setSelectedSubjectData(cs);
    setIsViewDialogOpen(true);
  };

  // Get teacher display name
  const getTeacherDisplayName = (teacher: ClassSubject['teacher']) => {
    if (!teacher) return null;
    if (teacher.firstName || teacher.lastName) {
      return `${teacher.firstName || ''} ${teacher.lastName || ''}`.trim();
    }
    return teacher.name || teacher.email || 'Unknown Teacher';
  };

  // Table columns
  const classSubjectsColumns = [
    {
      id: 'imgUrl',
      key: 'imgUrl',
      header: 'Image',
      format: (_: any, row: ClassSubject) => (
        <div 
          className="w-14 h-14 rounded-lg overflow-hidden bg-muted cursor-pointer hover:ring-2 hover:ring-primary transition-all"
          onClick={() => {
            const imgUrl = row.subject?.imgUrl;
            if (imgUrl) {
              setPreviewImage({ url: resolveImageUrl(imgUrl), title: `${row.subject?.name || 'Subject'} - Image` });
            }
          }}
        >
          <img
            src={resolveImageUrl(row.subject?.imgUrl)}
            alt={row.subject?.name ? `Subject ${row.subject.name}` : 'Subject image'}
            className="w-full h-full object-cover"
            onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/placeholder.svg'; }}
          />
        </div>
      )
    },
    {
      key: 'code',
      header: 'Code',
      format: (_: any, row: ClassSubject) => (
        <span className="font-mono text-sm font-medium">{row.subject?.code || 'N/A'}</span>
      )
    },
    {
      key: 'name',
      header: 'Subject Name',
      format: (_: any, row: ClassSubject) => row.subject?.name || <span className="text-muted-foreground italic">No name</span>
    },
    {
      key: 'category',
      header: 'Category',
      format: (_: any, row: ClassSubject) => row.subject?.category ? (
        <Badge variant="outline">{row.subject.category}</Badge>
      ) : (
        <span className="text-muted-foreground italic">N/A</span>
      )
    },
    {
      key: 'teacher',
      header: 'Assigned Teacher',
      format: (_: any, row: ClassSubject) => {
        const teacher = row.teacher;
        if (!teacher) {
          return (
            <span className="text-muted-foreground italic flex items-center gap-2">
              <Users className="h-4 w-4" />
              No teacher assigned
            </span>
          );
        }
        
        const displayName = getTeacherDisplayName(teacher);
        return (
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={resolveImageUrl(teacher.imageUrl)} />
              <AvatarFallback className="text-xs">
                {displayName?.charAt(0)?.toUpperCase() || 'T'}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{displayName}</p>
              {teacher.email && (
                <p className="text-xs text-muted-foreground">{teacher.email}</p>
              )}
            </div>
          </div>
        );
      }
    },
    {
      key: 'isActive',
      header: 'Status',
      format: (_: any, row: ClassSubject) => (
        <Badge variant={row.isActive ? 'default' : 'secondary'} className={row.isActive ? 'bg-green-600' : 'bg-gray-500'}>
          {row.isActive ? 'Active' : 'Inactive'}
        </Badge>
      )
    },
    {
      key: 'actions',
      header: 'Actions',
      format: (_: any, row: ClassSubject) => (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleViewSubject(row)}
            title="View details"
          >
            <Eye className="h-4 w-4" />
          </Button>
          
          {canManageTeachers && (
            <>
              {!row.teacher ? (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleAssignTeacherClick(row)}
                  className="text-blue-600 hover:text-blue-700"
                  title="Assign teacher"
                >
                  <UserPlus className="h-4 w-4" />
                </Button>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleAssignTeacherClick(row)}
                    className="text-blue-600 hover:text-blue-700"
                    title="Change teacher"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleUnassignTeacherClick(row)}
                    className="text-red-600 hover:text-red-700"
                    title="Remove teacher"
                  >
                    <UserMinus className="h-4 w-4" />
                  </Button>
                </>
              )}
            </>
          )}
        </div>
      )
    }
  ];

  // Show message if no class selected
  if (!currentClassId) {
    return (
      <div className="p-6 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-yellow-500" />
              No Class Selected
            </CardTitle>
            <CardDescription>
              Please select a class from the classes section to view and manage class subjects.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  // Show message if no institute selected
  if (!currentInstituteId) {
    return (
      <div className="p-6 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-yellow-500" />
              No Institute Selected
            </CardTitle>
            <CardDescription>
              Please select an institute from the dashboard to manage subjects.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <BookOpen className="h-6 w-6" />
            Class Subjects
          </h1>
          <p className="text-muted-foreground mt-1">
            {selectedClass?.name 
              ? `Manage subjects for ${selectedClass.name}` 
              : 'Manage subjects and teacher assignments for this class'}
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => fetchClassSubjects(true)} 
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Info about class context */}
      <Alert>
        <BookOpen className="h-4 w-4" />
        <AlertDescription>
          Showing subjects assigned to <strong>{selectedClass?.name || 'this class'}</strong>. 
          You can manage teacher assignments for each subject.
        </AlertDescription>
      </Alert>

      {/* Filters */}
      {showFilters && (
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Search</label>
                <Input 
                  placeholder="Search by code, name..." 
                  value={searchTerm} 
                  onChange={e => setSearchTerm(e.target.value)} 
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">Status</label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{filteredSubjects.length}</div>
            <p className="text-sm text-muted-foreground">Total Subjects</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">
              {filteredSubjects.filter(s => s.isActive).length}
            </div>
            <p className="text-sm text-muted-foreground">Active</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-600">
              {filteredSubjects.filter(s => s.teacher).length}
            </div>
            <p className="text-sm text-muted-foreground">With Teacher</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-orange-600">
              {filteredSubjects.filter(s => !s.teacher).length}
            </div>
            <p className="text-sm text-muted-foreground">No Teacher</p>
          </CardContent>
        </Card>
      </div>

      {/* Subjects Table */}
      <div className="w-full overflow-x-auto">
        <MUITable
          title="Class Subjects"
          data={filteredSubjects}
          columns={classSubjectsColumns.map(col => ({
            id: col.key,
            label: col.header,
            minWidth: col.key === 'actions' ? 150 : col.key === 'teacher' ? 200 : 120,
            format: col.format
          }))}
          page={0}
          rowsPerPage={50}
          totalCount={filteredSubjects.length}
          onPageChange={() => {}}
          onRowsPerPageChange={() => {}}
          sectionType="subjects"
        />
      </div>

      {/* Assign Teacher Dialog */}
      <Dialog open={isAssignTeacherDialogOpen} onOpenChange={setIsAssignTeacherDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {selectedSubjectForTeacher?.teacher ? 'Change Teacher' : 'Assign Teacher'}
            </DialogTitle>
            <DialogDescription>
              {selectedSubjectForTeacher?.teacher 
                ? `Update the teacher for ${selectedSubjectForTeacher?.subject?.name}`
                : `Assign a teacher to ${selectedSubjectForTeacher?.subject?.name}`
              }
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Select Teacher</label>
              <TeacherAutocomplete
                value={selectedTeacherId}
                onChange={setSelectedTeacherId}
                placeholder="Search and select a teacher..."
              />
            </div>
            
            {selectedSubjectForTeacher?.teacher && (
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">Currently assigned:</p>
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={resolveImageUrl(selectedSubjectForTeacher.teacher.imageUrl)} />
                    <AvatarFallback className="text-xs">
                      {getTeacherDisplayName(selectedSubjectForTeacher.teacher)?.charAt(0)?.toUpperCase() || 'T'}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium">
                    {getTeacherDisplayName(selectedSubjectForTeacher.teacher)}
                  </span>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsAssignTeacherDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={confirmAssignTeacher} 
              disabled={isAssigningTeacher || !selectedTeacherId}
            >
              {isAssigningTeacher ? 'Assigning...' : 'Assign Teacher'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Unassign Teacher Confirmation */}
      <AlertDialog open={showUnassignConfirm} onOpenChange={(open) => !isUnassigning && setShowUnassignConfirm(open)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Teacher Assignment</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove the teacher from <strong>{subjectToUnassign?.subject?.name}</strong>?
              <br /><br />
              This will unassign {getTeacherDisplayName(subjectToUnassign?.teacher)} from this subject.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isUnassigning}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmUnassignTeacher}
              disabled={isUnassigning}
              className="bg-red-600 hover:bg-red-700"
            >
              {isUnassigning ? 'Removing...' : 'Remove Teacher'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* View Subject Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Subject Details</DialogTitle>
          </DialogHeader>
          {selectedSubjectData && (
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-24 h-24 rounded-lg overflow-hidden bg-muted">
                  <img
                    src={resolveImageUrl(selectedSubjectData.subject?.imgUrl)}
                    alt={selectedSubjectData.subject?.name}
                    className="w-full h-full object-cover"
                    onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/placeholder.svg'; }}
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{selectedSubjectData.subject?.name}</h3>
                  <p className="text-sm font-mono text-muted-foreground">{selectedSubjectData.subject?.code}</p>
                  <Badge variant={selectedSubjectData.isActive ? 'default' : 'secondary'} className="mt-2">
                    {selectedSubjectData.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <label className="text-sm text-muted-foreground">Category</label>
                  <p className="font-medium">{selectedSubjectData.subject?.category || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Credit Hours</label>
                  <p className="font-medium">{selectedSubjectData.subject?.creditHours || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Subject Type</label>
                  <p className="font-medium">{selectedSubjectData.subject?.subjectType || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Basket Category</label>
                  <p className="font-medium">{selectedSubjectData.subject?.basketCategory || 'N/A'}</p>
                </div>
              </div>
              
              {/* Teacher Info */}
              <div className="pt-4 border-t">
                <label className="text-sm text-muted-foreground mb-2 block">Assigned Teacher</label>
                {selectedSubjectData.teacher ? (
                  <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={resolveImageUrl(selectedSubjectData.teacher.imageUrl)} />
                      <AvatarFallback>
                        {getTeacherDisplayName(selectedSubjectData.teacher)?.charAt(0)?.toUpperCase() || 'T'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{getTeacherDisplayName(selectedSubjectData.teacher)}</p>
                      {selectedSubjectData.teacher.email && (
                        <p className="text-sm text-muted-foreground">{selectedSubjectData.teacher.email}</p>
                      )}
                    </div>
                  </div>
                ) : (
                  <p className="text-muted-foreground italic">No teacher assigned</p>
                )}
              </div>
              
              <div className="flex justify-end gap-2 pt-4 border-t">
                {canManageTeachers && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsViewDialogOpen(false);
                      handleAssignTeacherClick(selectedSubjectData);
                    }}
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    {selectedSubjectData.teacher ? 'Change Teacher' : 'Assign Teacher'}
                  </Button>
                )}
                <Button variant="secondary" onClick={() => setIsViewDialogOpen(false)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Image Preview Dialog */}
      <Dialog open={!!previewImage} onOpenChange={() => setPreviewImage(null)}>
        <DialogContent className="max-w-2xl p-0">
          <DialogHeader className="p-4 pb-0">
            <DialogTitle>{previewImage?.title}</DialogTitle>
          </DialogHeader>
          <div className="p-4">
            {previewImage && (
              <img 
                src={previewImage.url} 
                alt={previewImage.title}
                className="w-full h-auto max-h-[70vh] object-contain rounded-lg"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InstituteSubjects;
