import api from "./api";
import type { UpdateUserPayload } from "./types/request.type";
import type { BaseResponse, UserResponse } from "./types/response.type";

async function updateMyInfo(payload: UpdateUserPayload): Promise<BaseResponse<UserResponse>> {
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
