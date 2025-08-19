import { useQuery } from "@tanstack/react-query";
import { getActivities } from "@/services/activities.service";

export const useActivities = () => {
  return useQuery({
    queryKey: ["activities"],
    queryFn: getActivities,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};
