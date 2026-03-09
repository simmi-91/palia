import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import type { PotatoPodEntry } from "../app/types/wikiTypes";

const fetchPotatoPods = async (): Promise<PotatoPodEntry[]> => {
  const response = await fetch(import.meta.env.VITE_API_URL + "/potato_pods");
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const data: PotatoPodEntry[] = await response.json();
  return data;
};

export const selectAllPotatoPods = (): UseQueryResult<
  PotatoPodEntry[],
  Error
> => {
  const query = useQuery({
    queryKey: ["PotatoPodsData"],
    queryFn: fetchPotatoPods,
    staleTime: 1000 * 60 * 5,
  });
  return query;
};

const fetchPotatoPodFamilies = async (): Promise<string[]> => {
  const response = await fetch(import.meta.env.VITE_API_URL + "/potato_pods/families");
  if (!response.ok) throw new Error("Network response was not ok");
  return response.json();
};

export const usePotatoPodFamilies = (): UseQueryResult<string[], Error> =>
  useQuery({
    queryKey: ["PotatoPodsData", "families"],
    queryFn: fetchPotatoPodFamilies,
    staleTime: 1000 * 60 * 5,
  });

export const selectPotatoPodById = (
  itemId: number,
): UseQueryResult<PotatoPodEntry | undefined, Error> => {
  return useQuery({
    queryKey: ["PotatoPodsData", itemId],
    queryFn: fetchPotatoPods,
    staleTime: 1000 * 60 * 5,
    select: (data) => data.find((item) => item.id === itemId),
  });
};
