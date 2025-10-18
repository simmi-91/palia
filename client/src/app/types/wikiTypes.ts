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
  howToObtain: MultilistEntry[];
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
