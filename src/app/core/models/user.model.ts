import { EmsEmployee } from './contact.model';

export type Role = 'EMPLOYEE' | 'MAIL_ADMIN' | 'SECURITY_ADMIN' | 'AUDITOR';

export interface UserProfile {
  id: string;
  username: string;
  officialEmail: string;
  firstName: string;
  lastName: string;
  department: string;
  designation: string;
  role: Role;
  avatarUrl?: string;
  isProvisioned: boolean;
}

export interface SecuritySession {
  id: string;
  ipAddress: string;
  userAgent: string;
  deviceInfo: string;
  location?: string;
  isCurrent: boolean;
  isRevoked: boolean;
  lastActiveAt: string;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  eventType: string;
  ipAddress: string;
  actionDetails: string;
  status: 'SUCCESS' | 'FAILURE' | 'WARNING';
  createdAt: string;
}
