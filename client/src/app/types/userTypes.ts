import { type TokenResponse } from "@react-oauth/google";

export type GoogleProfile = {
  id: string;
  email: string;
  given_name: string;
  picture: string;
};

export type UserInventoryItem = {
  category: string; // e.g., 'artifacts', 'plushies'
  itemId: number;
  amount: number;
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
  user: TokenResponse | null;
  profile: GoogleProfile | null;
  setUser: (token: TokenResponse | null) => void;
  logOut: () => void;
  inventory: UserInventoryItem[] | [];
  loadInventory: () => Promise<void>;
  updateInventoryAmount: (
    category: string,
    itemId: number,
    newAmount: number
  ) => void;
};
