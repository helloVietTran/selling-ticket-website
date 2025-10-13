import type { BaseResponse, Image } from "@/types";
import api from "./api";

async function uploadImage(payload: FormData): Promise<BaseResponse<Image>> {

  const res = await api.post('/resource', payload, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });

  return res.data;
}

export{
    uploadImage
}