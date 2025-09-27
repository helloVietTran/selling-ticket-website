import api from "./api";
import type { UpdateUserPayload } from '@/types';
import type { BaseResponse, User }  from '@/types';

async function updateMyInfo(payload: UpdateUserPayload): Promise<BaseResponse<User>> {
  const res = await api.put("/users", payload);

  return res.data;
}

async function getMyInfo(): Promise<void>{
    const res = await api.get("/users/my-info")
    return res.data;
}

export {
    getMyInfo,
    updateMyInfo
}
