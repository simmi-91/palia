import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import type { BugsEntry } from "../../app/types/wikiTypes";

const fetchBugs = async (): Promise<BugsEntry[]> => {
  const response = await fetch(import.meta.env.VITE_API_URL + "/bugs");
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const data: BugsEntry[] = await response.json();
  return data;
};

export const selectAllBugs = (): UseQueryResult<BugsEntry[], Error> => {
  const query = useQuery({
    queryKey: ["BugsData"],
    queryFn: fetchBugs,
    staleTime: 1000 * 60 * 5,
  });
  return query;
};

export const selectBugById = (
  itemId: number
): UseQueryResult<BugsEntry | undefined, Error> => {
  return useQuery({
    queryKey: ["BugsData"],
    queryFn: fetchBugs,
    staleTime: 1000 * 60 * 5,
    select: (data) => data.find((item) => item.id === itemId),
  });
};
