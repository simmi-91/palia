import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import type { StickerEntry } from "../../app/types/wikiTypes";

const fetchStickers = async (): Promise<StickerEntry[]> => {
  const response = await fetch(import.meta.env.VITE_API_URL + "/stickers");
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const data: StickerEntry[] = await response.json();
  return data;
};

export const selectAllStickers = (): UseQueryResult<StickerEntry[], Error> => {
  const query = useQuery({
    queryKey: ["StickerData"],
    queryFn: fetchStickers,
    staleTime: 1000 * 60 * 5,
  });
  return query;
};

export const selectStickerById = (
  itemId: number
): UseQueryResult<StickerEntry | undefined, Error> => {
  return useQuery({
    queryKey: ["StickerData"],
    queryFn: fetchStickers,
    staleTime: 1000 * 60 * 5,
    select: (data) => data.find((item) => item.id === itemId),
  });
};
