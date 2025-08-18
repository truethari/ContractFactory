import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getDeployments,
  createDeployment,
} from "@/services/deployments.service";

import type { ICreateDeploymentPayload } from "@/types/deployments.types";

export const useGetDeployments = () => {
  return useQuery({
    queryKey: ["deployments"],
    queryFn: getDeployments,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};

export const useCreateDeployment = () => {
  return useMutation({
    mutationFn: (payload: ICreateDeploymentPayload) =>
      createDeployment(payload),
  });
};
