export type EntityLink = {
    id: number;
    title: string;
    url: string;
    category?: string;
};

export type Item = {
    id: number;
    category: string;
    name: string;
    image?: string;
    url?: string;
    rarity: number;
    description?: string;
    time?: string;
    baseValue?: number;
    behavior?: string;
    bait?: string;
    family?: string;
    location: EntityLink[];
    neededFor: EntityLink[];
    howToObtain: EntityLink[];
};

export type InventoryItem = {
    category: string;
    itemId: number;
    amount: number;
};

export type TradeOffer = {
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

export type Category = {
    id: string;
    displayName: string;
    isVisible: boolean;
    isTradeable: boolean;
    isFavoritable: boolean;
    sortOrder: number;
};

export type GoogleProfile = {
    id: string;
    email: string;
    givenName: string;
    picture?: string;
};
