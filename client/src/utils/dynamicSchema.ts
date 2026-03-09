import * as Yup from "yup";
import type { MainItemEntry } from "../app/types/wikiTypes";

// type MultilistEntry
const MultiListItemSchema = Yup.object({
  title: Yup.string().required("Title is required for multi-list entry"),
  url: Yup.string().required("URL is required for multi-list entry"),
  category: Yup.string().nullable(),
});

const skipKeys = ["id"] as const;

export const createDynamicValidationSchema = (item: MainItemEntry) => {
  const schemaShape: Record<string, any> = {};

  for (const key of Object.keys(item) as Array<string>) {
    if (skipKeys.includes(key as (typeof skipKeys)[number])) {
      continue;
    }

    const value = (item as Record<string, unknown>)[key];

    // --- Handle Array/Multilist Fields ---
    if (Array.isArray(value)) {
      schemaShape[key as string] = Yup.array()
        .of(MultiListItemSchema)
        .min(0, `At least one ${key} entry is recommended`);
      continue;
    }

    if (key === "rarity") {
      schemaShape[key as string] = Yup.number()
        .typeError("Rarity must be a number")
        .nullable()
        .integer("Rarity must be a whole number")
        .min(1, "Rarity must be at least 1")
        .max(6, "Rarity cannot exceed 6");
      continue;
    }

    if (key === "baseValue") {
      schemaShape[key as string] = Yup.number()
        .typeError("Base Value must be a whole number")
        .nullable()
        .integer("Base Value must be a whole number")
        .min(0, "Base Value cannot be negative");
      continue;
    }

    const REQUIRED_STRINGS = ["name", "url", "category"];

    if (typeof value === "string" || value === null) {
      if (key === "image") {
        schemaShape[key as string] = Yup.string().trim().nullable();
        continue;
      }
      if (key === "url") {
        schemaShape[key as string] = Yup.string().trim().required(`${key} is required`).url("Must be a valid URL");
        continue;
      }
      if (REQUIRED_STRINGS.includes(key)) {
        schemaShape[key as string] = Yup.string().trim().required(`${key} is required`);
      } else {
        schemaShape[key as string] = Yup.string().trim().nullable();
      }
      continue;
    }
  }

  return Yup.object(schemaShape);
};
