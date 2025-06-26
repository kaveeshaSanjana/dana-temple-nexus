export interface Member {
  id?: number;
  name: string;
  nic: string;
  dob: string;
  address: string;
  email: string;
  phoneNumber: string;
}

export interface Family {
  id?: number;
  familyName: string;
  address: string;
  telephone: string;
}

export interface Village {
  id: number;
  villageName: string;
  templeId: number;
}

export interface MemberFamilyAssignmentDTO {
  memberIds: number[];
  familyId: number;
}

export interface FamilyWithMembersDTO {
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
