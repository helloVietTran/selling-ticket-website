import api from './api';
import type { LoginPayLoad, LogoutPayload, RegisterPayload } from '@/types';
import type { LoginResponse }  from '@/types';

async function signup(payload: RegisterPayload) {
    const res = await api.post("/auth/register", payload);
    return res.data;
}

async function signin(payload: LoginPayLoad): Promise<LoginResponse> {
    const res = await api.post("/auth/login", payload);
    return res.data;
}

async function logout(payload: LogoutPayload) {
    const res = await api.post("/auth/logout", payload);

    return res.data;
}

export {
    signup,
    signin,
    logout
}