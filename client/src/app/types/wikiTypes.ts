export type ArtifactEntry = {
  id: number;
  name: string;
  url: string;
  image: string;
};

export type PlushiesEntry = {
  id: number;
  name: string;
  url: string;
  image: string;
  rarity: string;
  howToObtain: Multilist_entry[];
};

export type BugsEntry = {
  id: number;
  name: string;
  url: string;
  image: string;
  rarity: string;
  time: string;
  behavior: string;
  description: string;
  baseValue: number;
  location: Multilist_entry[];
  neededFor: Multilist_entry[];
};

export type FishEntry = {
  id: number;
  name: string;
  url: string;
  image: string;
  rarity: string;
  time: string;
  description: string;
  baseValue: number;
  howToObtain: Multilist_entry[];
};

export type PotatoPodEntry = {
  id: number;
  name: string;
  url: string;
  image: string;
  family: string;
};

export type StickerEntry = {
  id: number;
  name: string;
  url: string;
  image: string;
  chatMessage: string;
};

export type Multilist_entry = {
  title: string;
  url: string;
  category: string;
};
