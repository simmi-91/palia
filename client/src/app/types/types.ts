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

export type FoodEntry = {
  food: string;
  category: string | null;
  base: FoodDetail;
  star: FoodDetail | null;
};

export type TreatEntry = {
  name: string;
  description: string;
  rarity: number;
  category: TreatCategoryEntry;
  image: string | null;
};

export type TreatCategoryEntry = {
  name: string;
  shape: string;
};
