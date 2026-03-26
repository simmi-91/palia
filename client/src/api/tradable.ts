import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import type { InventoryItem } from "../app/types/userTypes";

const fetchTradeable = async (
  profileId: string
): Promise<InventoryItem[]> => {
  const url = `${import.meta.env.VITE_API_URL}/inventory/tradeable/${profileId}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const data: InventoryItem[] = await response.json();
  return data;
};

export const selectAllTradeable = (
  profileId: string
): UseQueryResult<InventoryItem[], Error> => {
  const query = useQuery({
    queryKey: ["TradeableData", profileId],
    queryFn: () => fetchTradeable(profileId),
    staleTime: 1000 * 60 * 5,
    enabled: !!profileId,
  });
  return query;
};
