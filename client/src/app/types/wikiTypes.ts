export type MainItemEntry = {
  id: number;
  name: string;
  url: string;
  image: string;
};

export type ArtifactEntry = MainItemEntry;

export type CatchableEntry = MainItemEntry & {
  rarity: number;
  time: string;
  description: string;
  baseValue: number;
  location: Multilist_entry[];
  neededFor: Multilist_entry[];
};

export type BugsEntry = CatchableEntry & {
  behavior: string;
};

export type FishEntry = CatchableEntry & {
  howToObtain: Multilist_entry[];
  bait: Multilist_entry[];
};

export type PlushiesEntry = MainItemEntry & {
  rarity: number;
  howToObtain: Multilist_entry[];
};

export type PotatoPodEntry = MainItemEntry & {
  family: string;
};

export type StickerEntry = MainItemEntry & {
  rarity: number;
};

export type Multilist_entry = {
  title: string;
  url: string;
  category: string;
};
