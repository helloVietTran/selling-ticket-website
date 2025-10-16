import api from "./api";
import type { BaseResponse, Organizer }  from '@/types';

async function getMyOrganizerRecord(): Promise<BaseResponse<Organizer>> {
  const res = await api.get("/organizer/my");

  return res.data;
}

export {
    getMyOrganizerRecord
}
