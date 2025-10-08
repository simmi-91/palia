import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import type { UserInventoryItem } from "../../app/types/userTypes";

const fetchTradeable = async (
  profileId: string
): Promise<UserInventoryItem[]> => {
  const url = `${import.meta.env.VITE_API_URL}/inventory/tradeable/${profileId}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const data: UserInventoryItem[] = await response.json();
  return data;
};

export const selectAllTradeable = (
  profileId: string
): UseQueryResult<UserInventoryItem[], Error> => {
  const query = useQuery({
    queryKey: ["TradeableData", profileId],
    queryFn: () => fetchTradeable(profileId),
    staleTime: 1000 * 60 * 5,
    enabled: !!profileId,
  });
  return query;
};
