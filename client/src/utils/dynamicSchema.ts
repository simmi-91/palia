import * as Yup from "yup";
import type { Item } from "../app/types/wikiTypes";

// type EntityLink
const MultiListItemSchema = Yup.object({
  title: Yup.string().required("Title is required for multi-list entry"),
  url: Yup.string().required("URL is required for multi-list entry"),
  category: Yup.string().nullable(),
});

const skipKeys = ["id"] as const;

export const createDynamicValidationSchema = (item: Item) => {
  const schemaShape: Record<string, any> = {};

  for (const key of Object.keys(item)) {
    if (skipKeys.includes(key as (typeof skipKeys)[number])) {
      continue;
    }

    const value = (item as Record<string, unknown>)[key];

    // --- Handle Array/Multilist Fields ---
    if (Array.isArray(value)) {
      schemaShape[key] = Yup.array()
        .of(MultiListItemSchema)
        .min(0, `At least one ${key} entry is recommended`);
      continue;
    }

    if (key === "rarity") {
      schemaShape[key] = Yup.number()
        .typeError("Rarity must be a number")
        .nullable()
        .integer("Rarity must be a whole number")
        .min(0, "Rarity must be at least 0")
        .max(6, "Rarity cannot exceed 6");
      continue;
    }

    if (key === "baseValue") {
      schemaShape[key] = Yup.number()
        .typeError("Base Value must be a whole number")
        .nullable()
        .integer("Base Value must be a whole number")
        .min(0, "Base Value cannot be negative");
      continue;
    }

    const REQUIRED_STRINGS = ["name", "url", "category"];

    if (typeof value === "string" || value === null) {
      if (key === "image") {
        schemaShape[key] = Yup.string().trim().nullable();
        continue;
      }
      if (key === "url") {
        schemaShape[key] = Yup.string().trim().required(`${key} is required`).url("Must be a valid URL");
        continue;
      }
      if (REQUIRED_STRINGS.includes(key)) {
        schemaShape[key] = Yup.string().trim().required(`${key} is required`);
      } else {
        schemaShape[key] = Yup.string().trim().nullable();
      }
      continue;
    }
  }

  return Yup.object(schemaShape);
};
