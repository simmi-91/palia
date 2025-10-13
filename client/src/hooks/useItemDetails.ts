import { type UseQueryResult } from "@tanstack/react-query";
import type { MainItemEntry, CatchableEntry } from "../app/types/wikiTypes";

import { selectArtifactById } from "../features/slices/ArtifactsSlice";
import { selectPlushById } from "../features/slices/PlushiesSlice";
import { selectStickerById } from "../features/slices/StickerSlice";
import { selectPotatoPodById } from "../features/slices/PotatoPodsSlice";

type ItemSelector = (
  itemId: number
) => UseQueryResult<MainItemEntry | CatchableEntry | undefined, Error>;

const selectorMap: { [key: string]: ItemSelector } = {
  artifacts: selectArtifactById,
  plushies: selectPlushById,
  potatopods: selectPotatoPodById,
  stickers: selectStickerById,
};

export const useItemDetails = (itemCategory: string, itemId: number) => {
  const useItemSelector: ItemSelector | undefined = selectorMap[itemCategory];
  const { data: itemObject, isLoading: isItemLoading } = useItemSelector
    ? useItemSelector(itemId)
    : { data: undefined, isLoading: false };

  return { itemObject, isItemLoading };
};
