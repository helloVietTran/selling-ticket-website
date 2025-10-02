import { Role } from './enum';

export interface Requester {
  id: string;
  email: string;
  role: Role;
  iat?: number;
  exp?: number;
}
export interface statsData {
  ticketType: string;
  totalQuantity: number;
  soldTicket: number;
  totalTicket: number | null;
  totalsoldTicket: number | null;
  percentage: string;
}
