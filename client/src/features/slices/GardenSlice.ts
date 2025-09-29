import { CROPS } from "../../app/shared/CROPS.ts";
import { type CROP_Entry } from "../../app/types/gardenTypes.ts";

export const selectAllCrops = (): CROP_Entry[] => {
  return CROPS;
};
