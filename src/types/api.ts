
export interface Temple {
  id: number;
  name: string;
  address: string;
  phoneNumber?: string;
  description?: string;
  contactNumber?: string;
  email?: string;
  headMonkId?: number;
  headMonkName?: string;
  villageId?: number;
  villageName?: string;
  active: boolean;
  breakfastSlots: number;
  lunchSlots: number;
  familiesPerMeal: number;
  villageIds: number[];
}

export interface Family {
  id: number;
  name: string;
  address: string;
  phoneNumber?: string;
  villageId?: number;
  villageName?: string;
  templeId?: number;
  templeName?: string;
  members: FamilyMember[];
}

export interface FamilyMember {
  id: number;
  name: string;
  dateOfBirth: string;
  phoneNumber?: string;
}

export interface Village {
  id: number;
  name: string;
  description?: string;
  temple?: Temple;
  families: Family[];
  active: boolean;
}

export type TimeSlot = 'BREAKFAST' | 'LUNCH' | 'DINNER';
export type DanaStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';

export interface DanaAssignment {
  id: number;
  temple: Temple;
  families: Family[];
  date: string;
  timeSlot: TimeSlot;
  notes?: string;
  confirmationToken?: string;
  confirmed: boolean;
  confirmationTime?: string;
  reminderSent: boolean;
  reminderSentAt?: string;
  status: DanaStatus;
}

export interface SystemStats {
  totalUsers: number;
  totalTemples: number;
  totalDanas: number;
  totalFamilies: number;
  activeDanas: number;
  maintenanceMode: boolean;
}
