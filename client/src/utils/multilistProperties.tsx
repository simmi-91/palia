import type {
  MultilistEntry,
  MultilistProps,
  MainItemEntry,
} from "../app/types/wikiTypes";

export const getMultiListProps = (
  data: MainItemEntry,
  skipKeys?: [string]
): MultilistProps[] => {
  const multiListProperties: { title: string; list: MultilistEntry[] }[] = [];
  for (const key in data) {
    if (skipKeys && skipKeys.includes(key)) {
      //skip
    } else if (Object.prototype.hasOwnProperty.call(data, key)) {
      const value = data[key as keyof typeof data];
      if (Array.isArray(value)) {
        if (value.length > 0) {
          const isMultiList =
            typeof value[0] === "object" &&
            value[0] !== null &&
            "title" in value[0];

          if (isMultiList) {
            const title = key
              .replace(/([A-Z])/g, " $1")
              .replace(/^./, (str) => str.toUpperCase());

            multiListProperties.push({
              title: title,
              list: value as MultilistEntry[],
            });
          }
        }
      }
    }
  }
  return multiListProperties;
};
