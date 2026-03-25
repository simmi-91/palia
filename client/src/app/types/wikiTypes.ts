export type MultilistEntry = {
  title: string;
  url: string;
  category: string;
};
export type MultilistProps = {
  title: string;
  list: MultilistEntry[];
};

export type CategoryEntry = {
  id: string;
  display_name: string;
  is_visible: boolean;
  is_tradeable: boolean;
  is_favoritable: boolean;
};

export type ItemEntry = {
  id: number;
  name: string;
  url: string;
  image: string;
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
