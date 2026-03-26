import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { useAuth } from "../../context/AuthContext";
import { useQueryClient } from "@tanstack/react-query";
import type { Item } from "../../app/types/wikiTypes";

import { LoadingState, ErrorState, EmptyCategoryState } from "../../components/CommonStates";
import ItemForm from "../../components/edit/ItemForm";
import ItemFilters from "../../components/ItemFilters";

import { selectAllItems } from "../../api/items";
import { selectAllCategories } from "../../api/categories";

export const Route = createFileRoute("/admin/edit-items")({
    component: EditItems,
});

const ITEMS_QUERY_KEY = "ItemsData";

const requiredFieldsMap: Record<string, string[]> = {
    bugs: ["image", "location"],
    fish: ["image", "location", "bait"],
    plushies: ["image", "howToObtain"],
    stickers: ["image"],
    artifacts: ["image"],
    potatopods: ["image", "family"],
};

const getMissingFields = (item: Item): string[] => {
    const fields = requiredFieldsMap[item.category] ?? [];
    return fields.filter((field) => {
        const value = (item as Record<string, unknown>)[field];
        if (Array.isArray(value)) return value.length === 0;
        return !value;
    });
};

const createBlankItem = (category: string): Item => ({
    id: 0,
    name: "",
    url: "",
    image: "",
    category,
    rarity: undefined,
    description: undefined,
    time: undefined,
    baseValue: undefined,
    behavior: undefined,
    bait: undefined,
    family: undefined,
    location: [],
    neededFor: [],
    howToObtain: [],
});

function EditItems() {
    const { profile, makeAuthenticatedRequest } = useAuth();
    const queryClient = useQueryClient();
    const [activeCategory, setActiveCategory] = useState("bugs");
    const [activeItem, setActiveItem] = useState<Item | undefined>();
    const [searchQuery, setSearchQuery] = useState("");
    const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});

    const {
        data: allItems,
        isLoading: itemLoad,
        isError: itemErr,
        error: itemError,
    } = selectAllItems();
    const {
        data: categoryData,
        isLoading: catLoad,
        isError: catErr,
        error: catError,
    } = selectAllCategories();

    const categoryItems = useMemo(() => {
        if (activeCategory === "all") return allItems ?? [];
        return (allItems ?? []).filter((item) => item.category === activeCategory);
    }, [allItems, activeCategory]);

    const filteredItems = useMemo(() => {
        const q = searchQuery.trim().toLowerCase();
        let result = q
            ? categoryItems.filter((item) => item.name.toLowerCase().includes(q))
            : categoryItems;

        for (const [filterType, selected] of Object.entries(activeFilters)) {
            if (selected && selected !== "all") {
                result = result.filter((item) => {
                    const itemValue = (item as Record<string, unknown>)[filterType];
                    return String(itemValue) === selected;
                });
            }
        }
        return result;
    }, [categoryItems, searchQuery, activeFilters]);

    if (!profile) return null;
    if (itemLoad || catLoad) return <LoadingState color="dark" />;
    if (itemErr || catErr) return <ErrorState error={itemError ?? catError} />;
    if (!allItems || allItems.length === 0) return <EmptyCategoryState />;

    const handleSave = async (values: Item) => {
        const isNew = values.id === 0;
        const method = isNew ? "POST" : "PUT";
        const url = isNew
            ? `${import.meta.env.VITE_API_URL}/items`
            : `${import.meta.env.VITE_API_URL}/items/${values.id}`;
        const response = await makeAuthenticatedRequest(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(values),
        });
        if (!response.ok) throw new Error("Failed to save item");
        if (isNew) {
            const data = await response.json();
            setActiveItem({ ...values, id: data.id });
        }
        queryClient.invalidateQueries({ queryKey: [ITEMS_QUERY_KEY] });
    };

    const handleDelete = async (id: number) => {
        const url = `${import.meta.env.VITE_API_URL}/items/${id}`;
        const response = await makeAuthenticatedRequest(url, { method: "DELETE" });
        if (!response.ok) throw new Error("Failed to delete item");
        setActiveItem(undefined);
        queryClient.invalidateQueries({ queryKey: [ITEMS_QUERY_KEY] });
    };

    const handleSelectCategory = (value: string) => {
        setActiveCategory(value);
        setActiveItem(undefined);
        setSearchQuery("");
        setActiveFilters({});
    };

    return (
        <div className="container-fluid">
            <div className="row my-1 align-items-end g-2">
                <div className="col-12 col-sm-5">
                    <div className="form-floating">
                        <select
                            className="form-select"
                            id="selectItemCollection"
                            aria-label="Select category"
                            value={activeCategory}
                            onChange={(e) => handleSelectCategory(e.target.value)}>
                            <option value="all">All categories</option>
                            {categoryData?.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.displayName}
                                </option>
                            ))}
                        </select>
                        <label htmlFor="selectItemCollection">Category</label>
                    </div>
                </div>
                <div className="col-12 col-sm-5">
                    <div className="form-floating">
                        <input
                            id="searchItems"
                            type="text"
                            className="form-control"
                            placeholder="Search"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <label htmlFor="searchItems">Search by name</label>
                    </div>
                </div>
                <div className="col-auto">
                    <button
                        className="btn btn-success"
                        disabled={activeCategory === "all"}
                        onClick={() => setActiveItem(createBlankItem(activeCategory))}>
                        New Item
                    </button>
                </div>
            </div>

            <div className="row px-2 mb-2">
                <div className="col d-flex align-items-center gap-2">
                    <ItemFilters
                        data={categoryItems}
                        activeFilters={activeFilters}
                        onChange={setActiveFilters}
                    />
                    {(searchQuery ||
                        Object.values(activeFilters).some((v) => v && v !== "all")) && (
                        <button
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() => {
                                setSearchQuery("");
                                setActiveFilters({});
                            }}>
                            Reset filters
                        </button>
                    )}
                </div>
            </div>

            <div className="row px-2">
                <div
                    className="col-12 col-md-3 overflow-y-scroll border"
                    style={{ height: window.innerWidth < 768 ? "150px" : "70vh" }}>
                    {filteredItems.map((item) => (
                        <div key={item.id} className="col d-flex p-1">
                            <button
                                onClick={() => setActiveItem(item)}
                                className={
                                    activeItem && item.id === activeItem.id
                                        ? "btn-info btn mx-1 flex-fill text-start"
                                        : "btn-primary btn mx-1 flex-fill text-start"
                                }>
                                {item.id} - {item.name}
                                {getMissingFields(item).length > 0 && (
                                    <i
                                        className="bi bi-exclamation-triangle-fill text-warning float-end"
                                        title={`Missing: ${getMissingFields(item).join(", ")}`}
                                    />
                                )}
                            </button>
                        </div>
                    ))}
                </div>

                <div className="col-9">
                    {activeItem ? (
                        <ItemForm
                            item={activeItem}
                            collectionName={activeItem.category}
                            onSave={handleSave}
                            onDelete={handleDelete}
                        />
                    ) : (
                        <div className="text-center">Select an item to edit</div>
                    )}
                </div>
            </div>
        </div>
    );
}
