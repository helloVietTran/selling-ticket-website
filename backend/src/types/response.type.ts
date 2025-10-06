import { User } from '../models/User.model';
import { Role } from './enum';

export interface BaseResponse<T> {
  message: string;
  status?: string | number;
  data?: T;
  accessToken?: string;
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
  UserName: string;
  phoneNumber: string;
  roles: Role;
}

export interface LoginOutput {
  user: User;
  accessToken: string;
}