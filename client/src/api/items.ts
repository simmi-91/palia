import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import type { ItemEntry } from "../app/types/wikiTypes";

const QUERYKEY = "ItemsData";

const fetchItems = async (): Promise<ItemEntry[]> => {
  const response = await fetch(import.meta.env.VITE_API_URL + "/items");
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const data: ItemEntry[] = await response.json();
  return data;
};

export const selectAllItems= (): UseQueryResult<ItemEntry[], Error> => {
  const query = useQuery({
    queryKey: [QUERYKEY],
    queryFn: fetchItems,
    staleTime: 1000 * 60 * 5,
  });
  return query;
};

export const selectItemById = (
  itemId: number,
): UseQueryResult<ItemEntry | undefined, Error> => {
  return useQuery({
    queryKey: [QUERYKEY, itemId],
    queryFn: fetchItems,
    staleTime: 1000 * 60 * 5,
    select: (data) => data.find((item) => item.id === itemId),
  });
};

export const selectItemsByCategory = (
    category: string,
  ): UseQueryResult<ItemEntry[], Error> => {
    return useQuery({
      queryKey: [QUERYKEY],
      queryFn: fetchItems,
      staleTime: 1000 * 60 * 5,
      select: (data) => data.filter((item) => item.category === category),
    });
  };

export const useItemCategories = (): UseQueryResult<string[], Error> =>
  useQuery({
    queryKey: [QUERYKEY],
    queryFn: fetchItems,
    staleTime: 1000 * 60 * 5,
    select: (data) => [...new Set(data.map((item) => item.category))],
  });

export const useItemBaits = (): UseQueryResult<string[], Error> =>
  useQuery({
    queryKey: [QUERYKEY],
    queryFn: fetchItems,
    staleTime: 1000 * 60 * 5,
    select: (data) => [...new Set(data.flatMap((item) => (item.bait ? [item.bait] : [])))],
  });

export const useItemBehaviors = (): UseQueryResult<string[], Error> =>
  useQuery({
    queryKey: [QUERYKEY],
    queryFn: fetchItems,
    staleTime: 1000 * 60 * 5,
    select: (data) => [...new Set(data.flatMap((item) => (item.behavior ? [item.behavior] : [])))],
  });

export const useItemFamilies = (): UseQueryResult<string[], Error> =>
  useQuery({
    queryKey: [QUERYKEY],
    queryFn: fetchItems,
    staleTime: 1000 * 60 * 5,
    select: (data) => [...new Set(data.flatMap((item) => (item.family ? [item.family] : [])))],
  });
