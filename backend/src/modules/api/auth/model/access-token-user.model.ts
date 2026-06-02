import { UserRole } from '@shared';

export interface AccessTokenUser {
  sub: string;
  email: string;
  role: UserRole;
  impersonatorId?: string;
}
