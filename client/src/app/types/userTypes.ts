import type {
    GoogleProfile as BaseGoogleProfile,
    TradeOffer,
    InventoryItem,
} from "@palia/shared";

export type { FavoriteItem, InventoryItem, TradeOffer } from "@palia/shared";

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
  login: (idToken: string | undefined) => Promise<AuthSession | null>;
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