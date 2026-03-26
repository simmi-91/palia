// Domain models — the types returned by db layer methods and sent in API responses

export type {
    EntityLink,
    Item,
    Category,
    GoogleProfile,
    InventoryItem,
    TradeOffer,
    FavoriteItem,
} from "@palia/shared";

import type { EntityLink, Item, Category } from "@palia/shared";

// Subset used when creating/updating links (no id needed)
export type EntityLinkInput = Omit<EntityLink, "id">;

// For POST /items and PUT /items/:id — id comes from the route param, not the body
export type ItemInput = Omit<Item, "id">;

export type CategoryInput = Omit<Category, "id">;

export type User = {
  id: number;
  google_id: string;
  email: string;
  givenName: string;
  picture: string | null;
  created_at: Date;
  admin: boolean;
};

export type FavoriteItemInput = {
  profileId: string;
  category: string;
  itemId: number;
};

export type ExternalLink = {
  id: number;
  site: string;
  url: string;
  logo: string | null;
  description: string | null;
};

export type ExternalLinkInput = Omit<ExternalLink, "id">;

export type EntityType = "location" | "neededFor" | "howToObtain";

// Maps frontend entity names to DB table names
export const ENTITY_TABLE_MAP: Record<EntityType, string> = {
  location: "location_entity",
  neededFor: "needed_for_entity",
  howToObtain: "how_to_obtain_entity",
};

// Standard operation result
export type DbResult = {
  success: boolean;
  error?: string;
};

export type DbResultWithId = DbResult & { id?: number };

export type DbResultWithCount = DbResult & { count: number };
