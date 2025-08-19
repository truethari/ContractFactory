import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getDeployments,
  createDeployment,
  updateDeployment,
  deleteDeployment,
} from "@/services/deployments.service";

import type {
  IDeployUpdatePayload,
  ICreateDeploymentPayload,
} from "@/types/deployments.types";

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

export const useUpdateDeployment = () => {
  return useMutation({
    mutationFn: (payload: IDeployUpdatePayload) => updateDeployment(payload),
  });
};

export const useDeleteDeployment = () => {
  return useMutation({
    mutationFn: (id: string) => deleteDeployment(id),
  });
};
