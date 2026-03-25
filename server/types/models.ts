// Domain models — the types returned by db layer methods and sent in API responses

export type MultilistEntry = {
  id: number;
  title: string;
  url: string;
  category: string | null;
};

// Subset used when creating/updating links (no id needed)
export type MultilistEntryInput = Omit<MultilistEntry, "id">;

export type Item = {
  id: number;
  category: string;
  name: string;
  image: string | null;
  url: string | null;
  rarity: number | null;
  description: string | null;
  time: string | null;
  baseValue: number | null;
  behavior: string | null;
  bait: string | null;
  family: string | null;
  location: MultilistEntryInput[];
  neededFor: MultilistEntryInput[];
  howToObtain: MultilistEntryInput[];
};

// For POST /items and PUT /items/:id — id comes from the route param, not the body
export type ItemInput = Omit<Item, "id">;

export type Category = {
  id: string;
  display_name: string;
  is_visible: boolean;
  is_tradeable: boolean;
  is_favoritable: boolean;
  sort_order: number;
};

export type CategoryInput = Omit<Category, "id">;

export type User = {
  id: number;
  google_id: string;
  email: string;
  given_name: string;
  picture: string | null;
  created_at: Date;
  admin: boolean;
};

export type GoogleProfile = {
  id: string;
  email: string;
  given_name: string;
  picture?: string;
};

export type InventoryItem = {
  category: string;
  itemId: number;
  amount: number;
};

export type TradeableItem = {
  userId: string;
  userName: string;
  category: string;
  itemId: number;
  amount: number;
};

export type FavoriteItem = {
  favoriteId: number;
  userId: string;
  itemId: number;
  category: string;
};

export type FavoriteItemInput = {
  profileId: string;
  category: string;
  itemId: number;
};

export type Link = {
  id: number;
  site: string;
  url: string;
  logo: string | null;
  description: string | null;
};

export type LinkInput = Omit<Link, "id">;

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
