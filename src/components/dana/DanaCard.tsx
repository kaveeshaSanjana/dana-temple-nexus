
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DanaAssignment } from '@/types/api';
import { Calendar, Clock, Users, CheckCircle, AlertCircle } from 'lucide-react';

interface DanaCardProps {
  assignment: DanaAssignment;
  showActions?: boolean;
  onConfirm?: () => void;
  onCancel?: () => void;
}

export function DanaCard({ assignment, showActions = false, onConfirm, onCancel }: DanaCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTimeSlotDisplay = (timeSlot: string) => {
    switch (timeSlot) {
      case 'BREAKFAST':
        return 'Breakfast';
      case 'LUNCH':
        return 'Lunch';
      case 'DINNER':
        return 'Dinner';
      default:
        return timeSlot;
    }
  };

  return (
    <Card className="border-blue-200 hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg text-blue-900">{assignment.temple.name}</CardTitle>
          <Badge className={getStatusColor(assignment.status)}>
            {assignment.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center text-sm text-blue-700">
          <Calendar className="w-4 h-4 mr-2" />
          <span>{new Date(assignment.date).toLocaleDateString()}</span>
        </div>
        
        <div className="flex items-center text-sm text-blue-700">
          <Clock className="w-4 h-4 mr-2" />
          <span>{getTimeSlotDisplay(assignment.timeSlot)}</span>
        </div>
        
        <div className="flex items-center text-sm text-blue-700">
          <Users className="w-4 h-4 mr-2" />
          <span>{assignment.families.length} Family(ies)</span>
        </div>

        {assignment.families.length > 0 && (
          <div className="text-sm">
            <span className="font-medium text-blue-900">Families:</span>
            <div className="mt-1">
              {assignment.families.map((family, index) => (
                <span key={family.id} className="text-blue-700">
                  {family.name}
                  {index < assignment.families.length - 1 && ', '}
                </span>
              ))}
            </div>
          </div>
        )}

        {assignment.notes && (
          <div className="text-sm">
            <span className="font-medium text-blue-900">Notes:</span>
            <p className="text-blue-700 mt-1">{assignment.notes}</p>
          </div>
        )}

        {showActions && assignment.status === 'PENDING' && (
          <div className="flex space-x-2 pt-2">
            <Button
              onClick={onConfirm}
              size="sm"
              className="bg-green-600 hover:bg-green-700 flex items-center"
            >
              <CheckCircle className="w-4 h-4 mr-1" />
              Confirm
            </Button>
            <Button
              onClick={onCancel}
              variant="outline"
              size="sm"
              className="border-red-200 text-red-600 hover:bg-red-50 flex items-center"
            >
              <AlertCircle className="w-4 h-4 mr-1" />
              Cancel
            </Button>
          </div>
        )}

        {assignment.confirmed && assignment.confirmationTime && (
          <div className="text-xs text-green-600 flex items-center">
            <CheckCircle className="w-3 h-3 mr-1" />
            Confirmed on {new Date(assignment.confirmationTime).toLocaleDateString()}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
