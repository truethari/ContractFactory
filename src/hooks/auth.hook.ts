import { login } from "@/services/auth.service";
import { useMutation } from "@tanstack/react-query";

import type { IAuthPayload } from "@/types/auth.types";

export const useLogin = () => {
  return useMutation({
    mutationFn: (payload: IAuthPayload) => login(payload),
  });
};
