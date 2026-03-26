import type {
  EntityLink,
  EntityLinkList,
  Item,
} from "../app/types/wikiTypes";

export const getMultiListProps = (
  data: Item,
  skipKeys?: [string],
  includeEmpty?: boolean
): EntityLinkList[] => {
  const multiListProperties: { title: string; list: EntityLink[] }[] = [];
  for (const key in data) {
    if (skipKeys && skipKeys.includes(key)) {
      //skip
    } else if (Object.prototype.hasOwnProperty.call(data, key)) {
      const value = data[key as keyof typeof data];
      if (Array.isArray(value)) {
        const isMultiList =
          value.length > 0
            ? typeof value[0] === "object" && value[0] !== null && "title" in value[0]
            : includeEmpty === true;

        if (isMultiList) {
          const title = key
            .replace(/([A-Z])/g, " $1")
            .replace(/^./, (str) => str.toUpperCase());

          multiListProperties.push({
            title: title,
            list: value,
          });
        }
      }
    }
  }
  return multiListProperties;
};
