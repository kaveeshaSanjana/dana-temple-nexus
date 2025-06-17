
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DanaAssignment, TimeSlot } from '@/types/api';
import { Calendar, Clock, Users, MapPin, CheckCircle, XCircle } from 'lucide-react';

interface DanaCardProps {
  assignment: DanaAssignment;
  onConfirm?: (assignment: DanaAssignment) => void;
  onCancel?: (assignment: DanaAssignment) => void;
  showActions?: boolean;
}

const timeSlotColors = {
  BREAKFAST: 'bg-orange-100 text-orange-800',
  LUNCH: 'bg-green-100 text-green-800',
  DINNER: 'bg-purple-100 text-purple-800',
};

const statusColors = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  CONFIRMED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
  COMPLETED: 'bg-blue-100 text-blue-800',
};

export function DanaCard({ assignment, onConfirm, onCancel, showActions = false }: DanaCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getTimeSlotLabel = (slot: TimeSlot) => {
    switch (slot) {
      case 'BREAKFAST':
        return 'Breakfast (7:00 AM)';
      case 'LUNCH':
        return 'Lunch (12:00 PM)';
      case 'DINNER':
        return 'Dinner (6:00 PM)';
      default:
        return slot;
    }
  };

  return (
    <Card className="border-blue-200 hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg text-blue-900">{assignment.temple.name}</CardTitle>
          <div className="flex space-x-2">
            <Badge className={timeSlotColors[assignment.timeSlot]}>
              {assignment.timeSlot}
            </Badge>
            <Badge className={statusColors[assignment.status]}>
              {assignment.status}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center space-x-2 text-gray-600">
            <Calendar className="h-4 w-4" />
            <span className="text-sm">{formatDate(assignment.date)}</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-600">
            <Clock className="h-4 w-4" />
            <span className="text-sm">{getTimeSlotLabel(assignment.timeSlot)}</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-gray-600">
            <Users className="h-4 w-4" />
            <span className="text-sm font-medium">Assigned Families:</span>
          </div>
          <div className="ml-6 space-y-1">
            {assignment.families.map((family) => (
              <div key={family.id} className="flex items-center justify-between">
                <span className="text-sm">{family.name}</span>
                <div className="flex items-center space-x-1 text-gray-500">
                  <MapPin className="h-3 w-3" />
                  <span className="text-xs">{family.villageName}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {assignment.notes && (
          <div className="bg-blue-50 p-3 rounded-md">
            <p className="text-sm text-blue-800">
              <strong>Notes:</strong> {assignment.notes}
            </p>
          </div>
        )}

        {showActions && assignment.status === 'PENDING' && (
          <div className="flex space-x-2 pt-2">
            {onConfirm && (
              <Button
                onClick={() => onConfirm(assignment)}
                size="sm"
                className="bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Confirm
              </Button>
            )}
            {onCancel && (
              <Button
                onClick={() => onCancel(assignment)}
                variant="outline"
                size="sm"
                className="border-red-200 text-red-600 hover:bg-red-50"
              >
                <XCircle className="mr-2 h-4 w-4" />
                Cancel
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
