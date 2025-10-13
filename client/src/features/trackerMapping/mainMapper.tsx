import { type UserInventoryItem } from "../../app/types/userTypes";

import artifactMap, { type artifactMapType } from "./artifactMap";
import stickerMap, { type stickersMapType } from "./stickerMap";
import { convertAnniversaryToOrdinal } from "./plushiesMap";

type DatabaseItem = {
  id: number;
  name: string;
};

type RawKeyDataItem = {
  key: string;
  amount: number;
};
type RawDataItem = {
  name: string;
  obtained: number;
};

export const mapItems = (
  category: string,
  databaseData: DatabaseItem[] | undefined,
  rawJsonData: RawKeyDataItem[] | RawDataItem[],
  setUploadStatus: (status: string) => void
): UserInventoryItem[] | null => {
  if (!databaseData) {
    setUploadStatus(`Data for ${category} has not yet loaded. Please wait.`);
    return null;
  }

  const nameToItemMap = new Map(
    databaseData.map((item: DatabaseItem) => [item.name, item])
  );
  console.log(nameToItemMap);

  const mappedData: UserInventoryItem[] = rawJsonData
    .map((item: RawKeyDataItem | RawDataItem) => {
      let nameToMap = "";
      let amount = 0;

      if (category === "artifacts" && "key" in item) {
        nameToMap = artifactMap[item.key as keyof artifactMapType] || item.key;
        amount = item.amount;
      } else if (category === "stickers" && "key" in item) {
        nameToMap = stickerMap[item.key as keyof stickersMapType] || item.key;
        amount = item.amount;

        console.log(nameToMap);
      } else if (category !== "artifacts" && "obtained" in item) {
        nameToMap = item.name;
        amount = item.obtained ? 1 : 0;

        if (nameToMap.includes("Anniversary")) {
          const anniversaryNumber = nameToMap.match(/First|Second|Third/i)?.[0];
          if (anniversaryNumber) {
            const ordinal = convertAnniversaryToOrdinal(anniversaryNumber);
            nameToMap = nameToMap.replace(
              `Happy Palia ${anniversaryNumber} Anniversary`,
              `${ordinal} Anniversary Plush`
            );
          }
        }
      }

      const databaseEntry = nameToItemMap.get(nameToMap);
      if (databaseEntry) {
        return {
          category: category,
          itemId: databaseEntry.id,
          amount: amount,
        };
      }
      return null;
    })
    .filter((item): item is UserInventoryItem => item !== null);

  /*if (rawJsonData.length !== mappedData.length) {
    const mappedNames = new Set(mappedData.map((p) => p.name));
    const differingNames = rawJsonData
      .filter((rawItem) => !mappedNames.has(rawItem.name))
      .map((rawItem) => rawItem.name);
    console.log("Differing plushie names:", differingNames);
  }*/

  return mappedData;
};
