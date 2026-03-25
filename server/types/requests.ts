// Typed req.body, req.params, and res.json shapes for route handlers
// Use with Express's generic Request<Params, ResBody, ReqBody, Query>

import type { ItemInput, InventoryItem, MultilistEntryInput, CategoryInput } from "./models.js";

// ---------------------------------------------------------------------------
// Shared
// ---------------------------------------------------------------------------

export type IdParam = {
  id: string; // path params are always strings — parse with parseInt()
};

export type ProfileIdParam = {
  profileId: string;
};

export type EntityParam = {
  entity: string;
};

// ---------------------------------------------------------------------------
// Items
// ---------------------------------------------------------------------------

export type CreateItemBody = ItemInput;
export type UpdateItemBody = ItemInput;

// ---------------------------------------------------------------------------
// Categories
// ---------------------------------------------------------------------------

export type CreateCategoryBody = {
  newCategory: CategoryInput;
};

export type UpdateCategoryBody = {
  newCategory: CategoryInput;
};

export type PatchCategoryBody = {
  display_name?: string;
  is_visible?: boolean;
  is_tradeable?: boolean;
  is_favoritable?: boolean;
};

// ---------------------------------------------------------------------------
// Entity
// ---------------------------------------------------------------------------

export type CreateEntityBody = {
  newItem: MultilistEntryInput;
};

export type UpdateEntityBody = {
  id: number;
  newItem: MultilistEntryInput;
};

export type DeleteEntityBody = {
  id: number;
};

// ---------------------------------------------------------------------------
// Favorites
// ---------------------------------------------------------------------------

export type AddFavoriteBody = {
  category: string;
  itemId: number;
};

export type DeleteFavoriteBody = {
  favoriteId: number;
};

// ---------------------------------------------------------------------------
// Inventory
// ---------------------------------------------------------------------------

export type UpdateInventoryBody = {
  profileId: string;
  category: string;
  itemId: number;
  amount: number;
};

export type BulkUpdateInventoryBody = {
  profileId: string;
  items: InventoryItem[];
};

// ---------------------------------------------------------------------------
// Users
// ---------------------------------------------------------------------------

export type CheckUserBody = {
  email: string;
};

export type RegisterUserBody = {
  id: string;
  email: string;
  given_name: string;
  picture?: string;
};

// ---------------------------------------------------------------------------
// Common response shapes
// ---------------------------------------------------------------------------

export type ErrorResponse = {
  error: string;
};

export type SuccessResponse = {
  success: boolean;
  message?: string;
  error?: string;
};

export type CheckUserResponse = {
  message: string;
  exists: boolean;
  isAdmin?: boolean;
};
