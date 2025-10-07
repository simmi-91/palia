export type FertilizerType = "HarvestBoost" | "QualityUp" | null;

export type FoodsWorms = {
  wormOutput: number | null;
  fertilizerOutput: number | null;
  fertilizerType: FertilizerType;
};

export type FoodDetail = {
  goldValue: number | null;
  focusAmount: number | null;
  worms: FoodsWorms;
  glowworms: FoodsWorms;
};

export type FOOD_entry = {
  food: string;
  category: string | null;
  base: FoodDetail;
  star: FoodDetail | null;
};

export type ARTIFACT_Entry = {
  id: number;
  name: string;
  url: string;
  image: string;
};

export type PLUSHIES_Entry = {
  id: number;
  name: string;
  url: string;
  image: string;
  rarity: string;
  howToObtain?: Multilist_entry[];
};

export type Multilist_entry = {
  title: string;
  url: string;
  category: string;
};
