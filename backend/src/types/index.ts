import { Role } from './enum';

export interface Requester {
  id: string;
  email: string;
  roles: Role;
  iat?: number;
  exp?: number;
}
