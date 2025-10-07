import { RARITY } from "../../app/shared/RARITY";
export type RARITY_Entry = {
  name: string;
  value: string;
  color_hex: string;
};

export const selectAllRarity = (): RARITY_Entry[] => {
  return RARITY;
};

export const selectRarityById = (id: string): RARITY_Entry | undefined => {
  return RARITY.find((item) => item.value === id);
};
