import { api } from "@/services/api.service";

import type { IAuthPayload } from "@/types/auth.types";

export const login = async (payload: IAuthPayload): Promise<void> => {
  const { data } = await api.post("/auth/login", payload);
  return data.data;
};
