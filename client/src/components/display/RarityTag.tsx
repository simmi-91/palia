import { selectRarityById } from "../../features/slices/RaritySlice";
import Tag from "./Tag";

const RarityTag = ({ id }: { id: string }) => {
  const rarity = selectRarityById(id);
  if (!rarity) {
    return "";
  }
  const { name, color_hex } = rarity;
  return <Tag text={name} bgColor={color_hex} />;
};

export default RarityTag;
