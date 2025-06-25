import { API_CONFIG } from '@/config/api';
import { AuthService } from '@/services/authService';
import { Member, Family, Village, MemberFamilyAssignmentDTO, FamilyWithMembersDTO } from '@/types/member';

export class MemberService {
  static async getAllMembers(): Promise<Member[]> {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.MEMBER}`, {
      headers: {
        ...AuthService.getAuthHeaders(),
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch members');
    }

    return response.json();
  }

  static async getMembersByFamily(familyId: number): Promise<Member[]> {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.MEMBER_BY_FAMILY}/${familyId}`, {
      headers: {
        ...AuthService.getAuthHeaders(),
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch members by family');
    }

    return response.json();
  }

  static async getMembersByTemple(templeId: number): Promise<Member[]> {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.MEMBER_BY_TEMPLE}/${templeId}`, {
      headers: {
        ...AuthService.getAuthHeaders(),
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch members by temple');
    }

    return response.json();
  }

  static async getMembersByVillage(villageId: number): Promise<Member[]> {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.MEMBER_BY_VILLAGE}/${villageId}`, {
      headers: {
        ...AuthService.getAuthHeaders(),
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch members by village');
    }

    return response.json();
  }

  static async getMemberById(id: number): Promise<Member> {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.MEMBER}/${id}`, {
      headers: {
        ...AuthService.getAuthHeaders(),
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch member');
    }

    return response.json();
  }

  static async getMemberByPhone(phoneNumber: string): Promise<Member> {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.MEMBER_BY_PHONE}/${phoneNumber}`, {
      headers: {
        ...AuthService.getAuthHeaders(),
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch member by phone');
    }

    return response.json();
  }

  static async createMember(memberData: Member): Promise<Member> {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.MEMBER}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...AuthService.getAuthHeaders(),
      },
      body: JSON.stringify(memberData),
    });

    if (!response.ok) {
      throw new Error('Failed to create member');
    }

    return response.json();
  }

  static async updateMember(id: number, memberData: Member): Promise<Member> {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.MEMBER}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...AuthService.getAuthHeaders(),
      },
      body: JSON.stringify(memberData),
    });

    if (!response.ok) {
      throw new Error('Failed to update member');
    }

    return response.json();
  }

  static async deleteMember(id: number): Promise<void> {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.MEMBER}/${id}`, {
      method: 'DELETE',
      headers: {
        ...AuthService.getAuthHeaders(),
      },
    });

    if (!response.ok) {
      throw new Error('Failed to delete member');
    }
  }

  // Family methods
  static async getAllFamilies(): Promise<Family[]> {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.FAMILY}`, {
      headers: {
        ...AuthService.getAuthHeaders(),
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch families');
    }

    return response.json();
  }

  static async createFamily(familyData: Family): Promise<Family> {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.FAMILY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...AuthService.getAuthHeaders(),
      },
      body: JSON.stringify(familyData),
    });

    if (!response.ok) {
      throw new Error('Failed to create family');
    }

    return response.json();
  }

  static async assignMembersToFamily(assignmentData: MemberFamilyAssignmentDTO): Promise<void> {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ASSIGN_MEMBERS_TO_FAMILY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...AuthService.getAuthHeaders(),
      },
      body: JSON.stringify(assignmentData),
    });

    if (!response.ok) {
      throw new Error('Failed to assign members to family');
    }
  }

  static async assignMembersToFamilyAtOnce(familyWithMembers: FamilyWithMembersDTO): Promise<Family> {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ASSIGN_MEMBERS_TO_FAMILY_AT_ONCE}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...AuthService.getAuthHeaders(),
      },
      body: JSON.stringify(familyWithMembers),
    });

    if (!response.ok) {
      throw new Error('Failed to assign members to family at once');
    }

    return response.json();
  }

  // Village methods
  static async getVillagesByTemple(templeId: number): Promise<Village[]> {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.TEMPLE_VILLAGE_BY_TEMPLE}/${templeId}`, {
      headers: {
        ...AuthService.getAuthHeaders(),
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch villages by temple');
    }

    return response.json();
  }
}
