import { Role } from "../types/types";

export interface BaseResponse<T> {
    message: string
    status?: string | number;
    data?: T
}


export interface UserOutput{
    id: number;
    email: string;
    UserName: string;
    phoneNumber: string;
    roles: Role
}
