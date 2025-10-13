import { FOOD } from "../../app/shared/FOOD";
import { type FoodEntry } from "../../app/types/types";

export const selectAllFoods = (): FoodEntry[] => {
  return FOOD;
};
