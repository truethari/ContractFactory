import { api } from "@/services/api.service";

import type {
  IDeployment,
  IDeployUpdatePayload,
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

export const updateDeployment = async (
  payload: IDeployUpdatePayload,
): Promise<IDeployment> => {
  const { id, ...rest } = payload;
  const { data } = await api.post(`/deployments/${id}/deploy`, rest);
  return data.data;
};

export const deleteDeployment = async (id: string): Promise<void> => {
  await api.delete(`/deployments/${id}`);
};
