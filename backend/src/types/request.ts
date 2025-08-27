import { Role } from "./enum";

export interface Requester {
  userId: string;
  email: string;
  role: Role;
  iat?: number;
  exp?: number;
}
