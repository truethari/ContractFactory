import { api } from "@/services/api.service";

import type { IActivity } from "@/types/activities.types";

export const getActivities = async (): Promise<IActivity[]> => {
  const { data } = await api.get("/activities");
  return data.data;
};
