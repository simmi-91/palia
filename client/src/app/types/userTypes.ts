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

export type AuthSession = {
  token: string;
  profile: GoogleProfile;
  expiresAt: number;
};

export interface TradeDisplayItem extends TradeOffer {
  offeringUsers: string[];
}

export type AuthContextType = {
  profile: GoogleProfile | null;
  authSession: AuthSession | null;
  login: (idToken: string | undefined) => void;
  logOut: () => void;
  inventory: InventoryItem[] | [];
  loadInventory: () => Promise<void>;
  updateInventoryAmount: (item: InventoryItem) => void;
  bulkUpdateInventory: (
    items: Array<{ category: string; itemId: number; amount: number }>
  ) => Promise<{ success: boolean; count?: number; error?: any }>;
};
