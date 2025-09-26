import { FOOD } from "../../app/shared/FOOD";
import { type FOOD_entry } from "../../app/types/types";

export const selectAllFoods = (): FOOD_entry[] => {
  return FOOD;
};
