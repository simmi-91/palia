import { type TokenResponse } from "@react-oauth/google";
import type {
    GoogleProfile as BaseGoogleProfile,
    TradeOffer,
    InventoryItem,
} from "@palia/shared";

export type { FavoriteItem, InventoryItem, TradeOffer } from "@palia/shared";

export interface ExtendedTokenResponse extends TokenResponse {
  refresh_token?: string;
}

export type GoogleProfile = BaseGoogleProfile & { isAdmin?: boolean };

export interface TradeDisplayItem extends TradeOffer {
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
  inventory: InventoryItem[] | [];
  loadInventory: () => Promise<void>;
  updateInventoryAmount: (item: InventoryItem) => void;
  bulkUpdateInventory: (
    items: Array<{ category: string; itemId: number; amount: number }>
  ) => Promise<{ success: boolean; count?: number; error?: any }>;
};
