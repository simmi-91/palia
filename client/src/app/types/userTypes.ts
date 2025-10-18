import { type TokenResponse } from "@react-oauth/google";

export interface ExtendedTokenResponse extends TokenResponse {
  refresh_token?: string;
}

export type GoogleProfile = {
  id: string;
  email: string;
  given_name: string;
  picture: string;
  isAdmin?: boolean;
};

export type UserInventoryItem = {
  category: string; // e.g., 'artifacts', 'plushies'
  itemId: number;
  amount: number;
};

export type FavoriteItem = {
  favoriteId: number;
  userId: string;
  category: string;
  itemId: number;
};

export type RawTradeItem = {
  category: string;
  itemId: number;
  amount: number;
  userId: string;
  userName: string;
};

export interface TradeDisplayItem extends RawTradeItem {
  offeringUsers: string[];
}

export type AuthContextType = {
  user: ExtendedTokenResponse | null;
  profile: GoogleProfile | null;
  setUser: (token: ExtendedTokenResponse | null) => void;
  logOut: () => void;
  makeAuthenticatedRequest: (
    url: string,
    options?: RequestInit
  ) => Promise<Response>;
  inventory: UserInventoryItem[] | [];
  loadInventory: () => Promise<void>;
  updateInventoryAmount: (item: UserInventoryItem) => void;
  bulkUpdateInventory: (
    items: Array<{ category: string; itemId: number; amount: number }>
  ) => Promise<{ success: boolean; count?: number; error?: any }>;
};
