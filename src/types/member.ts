

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
    familyName: string;
    address: string;
    phoneNumber: string;
  };
  members: {
    firstName: string;
    lastName: string;
    nic?: string;
    phoneNumber: string;
    address: string;
  }[];
  danaAssignments?: {
    templeDana: {
      id: number;
    };
    danaDate: string;
    description: string;
  }[];
}
