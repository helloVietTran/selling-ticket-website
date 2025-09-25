import api from './api';
import type { LoginPayLoad, LogoutPayload, RegisterPayload } from '@/types';
import type { TokenResponse }  from '@/types';

async function register(payload: RegisterPayload) {
    const res = await api.post("/auth/register", payload);
    return res.data;
}

async function login(payload: LoginPayLoad): Promise<TokenResponse> {
    const res = await api.post("/auth/login", payload);
    return res.data;
}

async function logout(payload: LogoutPayload) {
    const res = await api.post("/auth/logout", payload);

    return res.data;
}

export {
    register,
    login,
    logout
}