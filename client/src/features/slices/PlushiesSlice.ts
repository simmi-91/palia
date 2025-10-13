import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import type { PlushiesEntry } from "../../app/types/wikiTypes";

const fetchPlushies = async (): Promise<PlushiesEntry[]> => {
  const response = await fetch(import.meta.env.VITE_API_URL + "/plushies");
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const data: PlushiesEntry[] = await response.json();
  return data;
};

export const selectAllPlushies = (): UseQueryResult<PlushiesEntry[], Error> => {
  const query = useQuery({
    queryKey: ["PlushiesData"],
    queryFn: fetchPlushies,
    staleTime: 1000 * 60 * 5,
  });
  return query;
};

export const selectPlushById = (
  itemId: number
): UseQueryResult<PlushiesEntry | undefined, Error> => {
  return useQuery({
    queryKey: ["PlushiesData"],
    queryFn: fetchPlushies,
    staleTime: 1000 * 60 * 5,
    select: (data) => data.find((item) => item.id === itemId),
  });
};
