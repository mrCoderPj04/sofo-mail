export type AvailabilityStatus = 'ACTIVE' | 'IN_MEETING' | 'AWAY' | 'OUT_OF_OFFICE';

export interface EmsEmployee {
  id: string;
  employeeNumber: string;
  firstName: string;
  lastName: string;
  officialEmail: string;
  department: string;
  designation: string;
  location: string;
  phone?: string;
  availabilityStatus: AvailabilityStatus;
  avatarUrl?: string;
  managerName?: string;
}
