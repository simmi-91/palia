import { selectRarityByNumber } from "../../features/slices/RaritySlice";
import Tag from "./Tag";

const RarityTag = ({ number }: { number: number }) => {
  const rarity = selectRarityByNumber(number);
  if (!rarity || number < 1) {
    return null;
  }
  const { name, color_hex } = rarity;
  return <Tag text={name} bgColor={color_hex} />;
};

export default RarityTag;
