import { RARITY } from "../../app/shared/RARITY";
export type RARITY_Entry = {
  name: string;
  value: number;
  color_hex: string;
};

export const selectAllRarity = (): RARITY_Entry[] => {
  return RARITY;
};

export const selectRarityByNumber = (
  number: number
): RARITY_Entry | undefined => {
  return RARITY.find((item) => item.value === number);
};
