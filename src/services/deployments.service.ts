import { api } from "@/services/api.service";

import type {
  IDeployment,
  ICreateDeploymentPayload,
  ICreateDeploymentResponse,
} from "@/types/deployments.types";

export const getDeployments = async (): Promise<IDeployment[]> => {
  const { data } = await api.get("/deployments");
  return data.data;
};

export const createDeployment = async (
  payload: ICreateDeploymentPayload,
): Promise<ICreateDeploymentResponse> => {
  const { data } = await api.post("/deployments/compile", payload);
  return data.data;
};
