import api from './api';
import type { BaseResponse, LoginPayLoad, TokenPayload, RegisterPayload } from '@/types';
import type { LoginResponse }  from '@/types';

async function signup(payload: RegisterPayload) {
    const res = await api.post("/auth/register", payload);
    return res.data;
}

async function signin(payload: LoginPayLoad): Promise<BaseResponse<LoginResponse>> {
    const res = await api.post("/auth/login", payload);
    return res.data;
}

async function logout(payload: TokenPayload) {
    const res = await api.post("/auth/logout", payload);

    return res.data;
}

async function verifyToken(payload: TokenPayload): Promise<BaseResponse<{isAuthenticated: boolean}>> {
    const res = await api.post("/auth/verify-token", payload);

    return res.data;
}

export {
    signup,
    signin,
    logout,
    verifyToken
}