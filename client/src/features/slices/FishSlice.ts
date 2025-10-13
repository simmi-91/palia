import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import type { FishEntry } from "../../app/types/wikiTypes";

const fetchFish = async (): Promise<FishEntry[]> => {
  const response = await fetch(import.meta.env.VITE_API_URL + "/fish");
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const data: FishEntry[] = await response.json();
  return data;
};

export const selectAllFish = (): UseQueryResult<FishEntry[], Error> => {
  const query = useQuery({
    queryKey: ["FishData"],
    queryFn: fetchFish,
    staleTime: 1000 * 60 * 5,
  });
  return query;
};

export const selectFishById = (
  itemId: number
): UseQueryResult<FishEntry | undefined, Error> => {
  return useQuery({
    queryKey: ["FishData"],
    queryFn: fetchFish,
    staleTime: 1000 * 60 * 5,
    select: (data) => data.find((item) => item.id === itemId),
  });
};
