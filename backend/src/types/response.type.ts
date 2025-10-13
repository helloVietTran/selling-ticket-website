import { Role } from './enum';

export interface BaseResponse<T> {
  message: string;
  status?: string | number;
  data?: T;
}

export interface UploadResponse {
  url: string;
}
export interface statsResponse<T> {
  message: String;
  data: T;
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

export interface LoginOutput {
  user: UserOutput;
  accessToken: string;
}
