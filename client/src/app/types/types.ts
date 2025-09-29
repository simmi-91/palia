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
