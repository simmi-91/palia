import { type UseQueryResult } from "@tanstack/react-query";
import type { ArtifactEntry, PlushiesEntry } from "../app/types/wikiTypes";
import { selectArtifactById } from "../features/slices/ArtifactsSlice";
import { selectPlushById } from "../features/slices/PlushiesSlice";

type ItemSelector = (
  itemId: number
) => UseQueryResult<ArtifactEntry | PlushiesEntry | undefined, Error>;

const selectorMap: { [key: string]: ItemSelector } = {
  artifacts: selectArtifactById,
  plushies: selectPlushById,
};

export const useItemDetails = (itemCategory: string, itemId: number) => {
  const useItemSelector: ItemSelector | undefined = selectorMap[itemCategory];
  const { data: itemObject, isLoading: isItemLoading } = useItemSelector
    ? useItemSelector(itemId)
    : { data: undefined, isLoading: false };

  return { itemObject, isItemLoading };
};
