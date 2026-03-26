import { useState } from "react";
import { selectAllTradeable } from "../api/tradable";
import { selectAllCategories } from "../api/categories";

import type {
    InventoryItem,
    GoogleProfile,
    TradeOffer,
    TradeDisplayItem,
} from "../app/types/userTypes";
import InventoryItemDisplay, { type DisplayStyle } from "../components/display/InventoryItemDisplay";

type GroupedUserInventory = { [category: string]: InventoryItem[] };
type GroupedTradeInventory = { [category: string]: TradeDisplayItem[] };

const groupTradeOffers = (rawTradeInventory: TradeOffer[] | null): GroupedTradeInventory => {
    if (!rawTradeInventory) return {};
    const acc: GroupedTradeInventory = {};
    rawTradeInventory.forEach((item) => {
        if (item.amount <= 0) return;
        const { category, itemId, amount, userName } = item;
        if (!acc[category]) acc[category] = [];
        const existing = acc[category].find((g) => g.itemId === itemId);
        if (existing) {
            existing.amount += amount;
            if (!existing.offeringUsers.includes(userName)) existing.offeringUsers.push(userName);
        } else {
            acc[category].push({ category, itemId, amount, offeringUsers: [userName] } as TradeDisplayItem);
        }
    });
    return acc;
};

const groupInventoryByCategory = (inventory: InventoryItem[] | null): GroupedUserInventory => {
    if (!inventory) return {};
    return inventory.reduce((acc, item) => {
        if (item.amount <= 0) return acc;
        if (!acc[item.category]) acc[item.category] = [];
        acc[item.category].push(item);
        return acc;
    }, {} as GroupedUserInventory);
};

const getWantedItems = (
    tradeInventory: GroupedTradeInventory,
    userInventory: GroupedUserInventory
): GroupedTradeInventory => {
    const result: GroupedTradeInventory = {};
    for (const [category, items] of Object.entries(tradeInventory)) {
        const wanted = items.filter((item) => {
            const userCat = userInventory[category];
            if (!userCat) return true;
            return !userCat.some((u) => u.itemId === item.itemId && u.amount > 0);
        });
        if (wanted.length > 0) result[category] = wanted;
    }
    return result;
};

const renderItemList = (
    items: TradeDisplayItem[],
    userInventory: GroupedUserInventory | null,
    showAmount: boolean,
    alwaysShowUsers: boolean,
    displayStyle: DisplayStyle,
    showCategory = false
) => {
    const filtered = items.filter((item) => item.amount > 1);
    if (filtered.length === 0) return <p className="text-muted fst-italic">No items</p>;

    const gridCols = {
        card: "repeat(auto-fill, minmax(130px, 1fr))",
        compact: "repeat(auto-fill, minmax(220px, 1fr))",
        list: "repeat(auto-fill, minmax(280px, 1fr))",
    };

    return (
        <div style={{ display: "grid", gridTemplateColumns: gridCols[displayStyle], gap: "4px", padding: "4px 0" }}>
            {filtered.map((item) => {
                const userHas =
                    userInventory?.[item.category]?.some(
                        (u) => u.itemId === item.itemId && u.amount > 0
                    ) ?? false;
                return (
                    <InventoryItemDisplay
                        key={item.itemId}
                        item={item}
                        opacity={userHas ? 0.5 : 1}
                        offeringUsers={item.offeringUsers ?? []}
                        showAmount={showAmount}
                        alwaysShowUsers={alwaysShowUsers}
                        displayStyle={displayStyle}
                        showCategory={showCategory}
                    />
                );
            })}
        </div>
    );
};


const TradePage = ({
    profile,
    inventory,
}: {
    profile: GoogleProfile;
    inventory: InventoryItem[];
}) => {
    const [displayStyle, setDisplayStyle] = useState<DisplayStyle>(
        () => (localStorage.getItem("tradeDisplayStyle") as DisplayStyle) ?? "card"
    );
    const updateDisplayStyle = (style: DisplayStyle) => {
        setDisplayStyle(style);
        localStorage.setItem("tradeDisplayStyle", style);
    };
    const [activeCategory, setActiveCategory] = useState<string | null>(null);

    const { data: tradeableInventory, isLoading, isError, error } = selectAllTradeable(profile.id);
    const { data: categoryData } = selectAllCategories();

    if (isLoading) {
        return (
            <div className="text-center my-3">
                <div className="spinner-border text-dark" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <div>Loading trade data...</div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="text-center my-3">
                <div className="text-danger">Error loading data: {error.message}</div>
            </div>
        );
    }

    const categories = (categoryData ?? []).filter((c) => c.isTradeable);
    const categoryOrder: Record<string, number> = Object.fromEntries(
        categories.map((c) => [c.id, c.sortOrder])
    );

    const groupedUserInventory = groupInventoryByCategory(inventory);
    const groupedTradeInventory = groupTradeOffers((tradeableInventory as TradeOffer[]) || null);
    const wantedItems = getWantedItems(groupedTradeInventory, groupedUserInventory);
    const flatWantedItems = Object.keys(wantedItems)
        .sort((a, b) => (categoryOrder[a] ?? 99) - (categoryOrder[b] ?? 99))
        .flatMap((cat) => wantedItems[cat]);

    const firstWithItems = categories.find(
        (cat) =>
            (groupedUserInventory[cat.id] ?? []).filter((i) => i.amount > 1).length > 0 ||
            (groupedTradeInventory[cat.id] ?? []).filter((i) => i.amount > 1).length > 0
    )?.id ?? null;
    const effectiveActive = activeCategory ?? firstWithItems;

    const userItemsForCategory: TradeDisplayItem[] = effectiveActive
        ? (groupedUserInventory[effectiveActive] ?? []).map((i) => ({
              category: i.category,
              itemId: i.itemId,
              amount: i.amount,
              userId: "",
              userName: "",
              offeringUsers: [],
          }))
        : [];

    const othersItemsForCategory: TradeDisplayItem[] = effectiveActive
        ? (groupedTradeInventory[effectiveActive] ?? [])
        : [];

    const userCount = userItemsForCategory.filter((i) => i.amount > 1).length;
    const othersCount = othersItemsForCategory.filter((i) => i.amount > 1).length;

    return (
        <div className="container-fluid">
            {/* Header */}
            <div className="row align-items-center mb-2">
                <div className="col text-center">
                    <h2>Trading Post</h2>
                </div>
                <div className="col-auto">
                    <div className="btn-group" role="group" aria-label="Display style">
                        {(["card", "compact", "list"] as DisplayStyle[]).map((style) => (
                            <button
                                key={style}
                                type="button"
                                className={`btn btn-sm ${displayStyle === style ? "btn-dark" : "btn-outline-dark"}`}
                                onClick={() => updateDisplayStyle(style)}
                                title={style}>
                                <i className={`bi ${style === "card" ? "bi-grid-fill" : style === "compact" ? "bi-grid-3x3-gap-fill" : "bi-list-ul"}`} />
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Ready to trade */}
            <div className="row mb-3">
                <div className="col-12">
                    <h3 className="border-top border-bottom py-1">Ready to trade</h3>
                    {flatWantedItems.length > 0 ? (
                        renderItemList(flatWantedItems, null, false, true, displayStyle, true)
                    ) : (
                        <div className="alert alert-info text-center mb-0">
                            You already have everything others are offering
                        </div>
                    )}
                </div>
            </div>

            {/* Category tabs */}
            <div className="row mb-2">
                <div className="col-12">
                    <div className="d-flex flex-wrap gap-1">
                        {categories.map((cat) => {
                            const mine = (groupedUserInventory[cat.id] ?? []).filter((i) => i.amount > 1).length;
                            const others = (groupedTradeInventory[cat.id] ?? []).filter((i) => i.amount > 1).length;
                            return (
                                <button
                                    key={cat.id}
                                    type="button"
                                    className={`btn btn-sm ${effectiveActive === cat.id ? "btn-dark" : "btn-outline-dark"}`}
                                    onClick={() => {
                                        if (effectiveActive !== cat.id) setActiveCategory(cat.id);
                                    }}>
                                    {cat.displayName} ({mine}/{others})
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Active category content */}
            {effectiveActive && (
                <div className="row">
                    <div className="col-12 col-sm-6 border-end">
                        <h4 className="border-bottom py-1">I have ({userCount})</h4>
                        {userCount === 0 ? (
                            <p className="text-muted fst-italic">Nothing to trade in this category</p>
                        ) : (
                            renderItemList(userItemsForCategory, null, true, false, displayStyle)
                        )}
                    </div>
                    <div className="col-12 col-sm-6">
                        <h4 className="border-bottom py-1">Others have ({othersCount})</h4>
                        {othersCount === 0 ? (
                            <p className="text-muted fst-italic">Nobody is offering items in this category</p>
                        ) : (
                            renderItemList(othersItemsForCategory, groupedUserInventory, true, false, displayStyle)
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default TradePage;
