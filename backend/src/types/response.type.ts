import { Role } from './enum';

export interface BaseResponse<T> {
  message: string;
  status?: string | number;
  data?: T;
}

export interface UploadResponse {
  url: string;
}

export interface StatsTicketType {
  ticketTypeName: string;
  totalQuantity: number;
  soldTicket: number;
  percentage: string | number;
  totalTicket: number;
  totalSoldTicket: number;
  overallPercentage?: string | number;
}

export interface PaginateResponse<T> extends BaseResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
}

export interface UserOutput {
  id: number;
  email: string;
  userName: string;
  phoneNumber?: string;
  roles: Role;
}

export interface WeeklyRevenueResponse {
  eventId: number;
  totalRevenue: number;
  totalTicketsSold: number;
  dailyRevenue: {
    date: string;
    revenue: number;
    ticketsSold: number;
  }[];
}

export interface LoginOutput {
  user: UserOutput;
  accessToken: string;
}

export interface PredictRevenue {
  predictRevenue: number;
  realityRevenue: number;
  percentage: number | string;
}

export interface StatsTicket {
  eventId: number;
  totalSold: number;
  totalCheckedIn: number;
  percentage: number | string;
  predictTicketSold: number;
}
