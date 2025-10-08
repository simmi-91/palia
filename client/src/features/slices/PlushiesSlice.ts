import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import type { PLUSHIES_Entry } from "../../app/types/types";

const fetchPlushies = async (): Promise<PLUSHIES_Entry[]> => {
  const response = await fetch(import.meta.env.VITE_API_URL + "/plushies");
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const data: PLUSHIES_Entry[] = await response.json();
  return data;
};

export const selectAllPlushies = (): UseQueryResult<
  PLUSHIES_Entry[],
  Error
> => {
  const query = useQuery({
    queryKey: ["PlushiesData"],
    queryFn: fetchPlushies,
    staleTime: 1000 * 60 * 5,
  });
  return query;
};

export const selectPlushById = (
  itemId: number
): UseQueryResult<PLUSHIES_Entry | undefined, Error> => {
  return useQuery({
    queryKey: ["PlushiesData"],
    queryFn: fetchPlushies,
    staleTime: 1000 * 60 * 5,
    select: (data) => data.find((item) => item.id === itemId),
  });
};
