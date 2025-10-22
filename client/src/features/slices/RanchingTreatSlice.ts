import { TREATS, CATEGORIES } from "../../app/shared/RANCHINGTREAT";
import type { TreatEntry, TreatCategoryEntry } from "../../app/types/types";

export const selectAllTreats = (): TreatEntry[] => {
  return TREATS;
};

export const selectAllTreatCategories = (): TreatCategoryEntry[] => {
  return CATEGORIES;
};
