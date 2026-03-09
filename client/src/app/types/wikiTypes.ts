export type MultilistEntry = {
  title: string;
  url: string;
  category: string;
};
export type MultilistProps = {
  title: string;
  list: MultilistEntry[];
};

export type MainItemEntry = {
  id: number;
  name: string;
  url: string;
  image: string;
};

export type CatchableEntry = MainItemEntry & {
  rarity: number;
  time: string;
  description: string;
  baseValue: number;
  location: MultilistEntry[];
  neededFor: MultilistEntry[];
};

export type ArtifactEntry = MainItemEntry;

export type BugsEntry = CatchableEntry & {
  behavior: string;
};

export type FishEntry = CatchableEntry & {
  bait: string;
};

export type PlushiesEntry = MainItemEntry & {
  rarity: number;
  howToObtain: MultilistEntry[];
};

export type PotatoPodEntry = MainItemEntry & {
  family: string;
};

export type StickerEntry = MainItemEntry & {
  rarity: number;
};

export type CategoryEntry = {
  id: string;
  display_name: string;
  is_visible: boolean;
  is_tradeable: boolean;
  is_favoritable: boolean;
};

export type ItemEntry = MainItemEntry & {
  category: string;
  rarity: number | null;
  description: string | null;
  time: string | null;
  baseValue: number | null;
  behavior: string | null;
  bait: string | null;
  family: string | null;
  location: MultilistEntry[];
  neededFor: MultilistEntry[];
  howToObtain: MultilistEntry[];
};
