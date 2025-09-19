import { Role } from "./enum";

export interface Requester {
  id: string;
  email: string;
  role: Role;
  iat?: number;
  exp?: number;
}


