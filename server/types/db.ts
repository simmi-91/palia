// Raw MySQL row shapes — what mysql2 returns before mapping
// and createDB() return types for each db module

import type {
  Category,
  CategoryInput,
  DbResult,
  DbResultWithCount,
  DbResultWithId,
  FavoriteItem,
  FavoriteItemInput,
  GoogleProfile,
  InventoryItem,
  Item,
  ItemInput,
  Link,
  EntityType,
  MultilistEntry,
  MultilistEntryInput,
  TradeableItem,
  User,
} from "./models.js";

// ---------------------------------------------------------------------------
// Raw MySQL row types (snake_case, before mapping)
// ---------------------------------------------------------------------------

export type RawItemRow = {
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
  // JSON strings from JSON_ARRAYAGG subqueries
  location: string;
  neededFor: string;
  howToObtain: string;
};

export type RawInventoryRow = {
  user_id: string;
  category: string;
  item_id: number;
  amount: number;
};

export type RawFavoriteRow = {
  favorite_id: number;
  user_id: string;
  category: string;
  item_id: number;
};

export type RawEntityRow = {
  id: number;
  title: string;
  url: string;
  category: string | null;
};

export type RawTradeableRow = {
  user_id: string;
  given_name: string;
  category: string;
  item_id: number;
  amount: number;
};

// ---------------------------------------------------------------------------
// createDB() return types — one per db module
// ---------------------------------------------------------------------------

export type ItemsDb = {
  getAll(): Promise<Item[]>;
  addItem(data: ItemInput): Promise<DbResultWithId>;
  updateItem(id: number, data: ItemInput): Promise<DbResult>;
  deleteItem(id: number): Promise<DbResult>;
};

export type CategoriesDb = {
  getAllCategories(): Promise<Category[]>;
  addCategory(id: string, newCategory: CategoryInput): Promise<void>;
  updateCategory(id: string, newCategory: CategoryInput): Promise<void>;
  patchCategory(id: string, data: Partial<CategoryInput>): Promise<DbResult>;
  deleteCategory(id: string): Promise<DbResult>;
};

export type EntityDb = {
  getAllEntities(entity: EntityType): Promise<MultilistEntry[]>;
  addEntitiy(entity: EntityType, newItem: MultilistEntryInput): Promise<DbResultWithId>;
  updateEntitiy(entity: EntityType, id: number, newItem: Partial<MultilistEntryInput>): Promise<DbResultWithId>;
  deleteEntitiy(entity: EntityType, id: number): Promise<DbResultWithId>;
};

export type FavoritesDb = {
  getAll(userId: string): Promise<FavoriteItem[]>;
  addFavorite(newFavorite: FavoriteItemInput): Promise<FavoriteItem>;
  removeFavorite(favoriteId: number, userId: string): Promise<{ removed: boolean }>;
};

export type InventoryDb = {
  getAll(profileId: string): Promise<InventoryItem[]>;
  update(profileId: string, category: string, itemId: number, amount: number): Promise<DbResultWithCount>;
  bulkUpdate(profileId: string, items: InventoryItem[]): Promise<DbResultWithCount>;
  getTradeable(profileId: string): Promise<TradeableItem[]>;
};

export type LinksDb = {
  getAllLinks(): Promise<Link[]>;
  addLink(newLink: Omit<Link, "id">): Promise<void>;
};

export type UsersDb = {
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(profile: GoogleProfile): Promise<void>;
};
