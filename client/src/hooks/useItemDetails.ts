import { type UseQueryResult } from "@tanstack/react-query";
import type { ARTIFACT_Entry, PLUSHIES_Entry } from "../app/types/types";
import { selectArtifactById } from "../features/slices/ArtifactsSlice";
import { selectPlushById } from "../features/slices/PlushiesSlice";

type ItemSelector = (
  itemId: number
) => UseQueryResult<ARTIFACT_Entry | PLUSHIES_Entry | undefined, Error>;

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
