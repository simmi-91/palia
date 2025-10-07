import { type TokenResponse } from "@react-oauth/google";

export type RegistrationData = {
  id: string;
  email: string;
  given_name: string;
  picture: string;
};

export type GoogleProfile = {
  id: string;
  email: string;
  given_name: string;
  picture: string;
};

export type UserInventoryItem = {
  itemId: number;
  category: string; // e.g., 'artifacts', 'plushies'
  amount: number;
};

export type AuthContextType = {
  user: TokenResponse | null;
  profile: GoogleProfile | null;
  setUser: (token: TokenResponse | null) => void;
  logOut: () => void;
  inventory: UserInventoryItem[] | null;
  loadInventory: () => Promise<void>;
  updateInventoryAmount: (
    category: string,
    itemId: number,
    newAmount: number
  ) => void;
};
