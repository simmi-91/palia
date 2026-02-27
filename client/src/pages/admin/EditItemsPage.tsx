import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

import { type UseQueryResult } from "@tanstack/react-query";
import type { MainItemEntry, CatchableEntry } from "../../app/types/wikiTypes";

import ItemForm from "../../components/edit/ItemForm";

import { selectAllArtifacts } from "../../features/slices/ArtifactsSlice";
import { selectAllPlushies } from "../../features/slices/PlushiesSlice";
import { selectAllStickers } from "../../features/slices/StickerSlice";
import { selectAllPotatoPods } from "../../features/slices/PotatoPodsSlice";
import { selectAllBugs } from "../../features/slices/BugsSlice";
import { selectAllFish } from "../../features/slices/FishSlice";

type ItemSelector = () => UseQueryResult<MainItemEntry[] | CatchableEntry[] | undefined, Error>;

const selectorMap: { [key: string]: ItemSelector } = {
    artifacts: selectAllArtifacts,
    plushies: selectAllPlushies,
    stickers: selectAllStickers,
    potatopods: selectAllPotatoPods,
    bugs: selectAllBugs,
    fish: selectAllFish,
};

const collectionRouteMap: Record<string, string> = {
    artifacts: "artifacts",
    plushies: "plushies",
    stickers: "stickers",
    potatopods: "potato_pods",
    bugs: "bugs",
    fish: "fish",
};

const EditItemsPage = () => {
    const { profile, makeAuthenticatedRequest } = useAuth();
    const [activeItemCollection, setActiveItemCollection] = useState("bugs");
    const [activeItem, setActiveItem] = useState<MainItemEntry | undefined>();

    const useItemSelector = selectorMap[activeItemCollection] ?? selectorMap.bugs;
    const { data: itemCollection, isLoading } = useItemSelector();

    if (!profile) return null;

    const handleSave = async (values: MainItemEntry | CatchableEntry) => {
        const routeName = collectionRouteMap[activeItemCollection] ?? activeItemCollection;
        const response = await makeAuthenticatedRequest(
            `${import.meta.env.VITE_API_URL}/${routeName}/${values.id}`,
            {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
            }
        );
        if (!response.ok) throw new Error("Failed to save item");
    };

    const handleSelectCollection = (value: string) => {
        setActiveItemCollection(value);
        setActiveItem(undefined);
    };

    const handleSelectItem = (id: number) => {
        if (!id || !itemCollection) {
            return;
        }
        const itemObject = itemCollection.find((item) => item.id === id);
        setActiveItem(itemObject);
    };

    return (
        <div className="container-fluid">
            <div className="row my-1">
                <div className="col-12 col-sm-6">
                    <div className="form-floating">
                        <select
                            className="form-select"
                            id="selectItemCollection"
                            aria-label="Select Item collection"
                            defaultValue={activeItemCollection}
                            onChange={(e) => {
                                handleSelectCollection(e.target.value);
                            }}>
                            {Object.keys(selectorMap).map((item) => {
                                return (
                                    <option key={item} value={item}>
                                        {item}
                                    </option>
                                );
                            })}
                        </select>
                        <label htmlFor="selectItemCollection">Item collection:</label>
                    </div>
                </div>
            </div>

            {isLoading && (
                <div className="row">
                    <div className="spinner-border text-dark" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            )}

            {itemCollection && (
                <div className="row px-2">
                    <div
                        className="col-12 col-md-3 overflow-y-scroll border"
                        style={{ height: window.innerWidth < 768 ? "150px" : "70vh" }}>
                        {itemCollection.map((item) => {
                            return (
                                <div key={item.id} className="col d-flex p-1">
                                    <button
                                        onClick={() => handleSelectItem(item.id)}
                                        className={
                                            activeItem && item.id === activeItem.id
                                                ? "btn-info btn mx-1 flex-fill text-start"
                                                : "btn-primary btn mx-1 flex-fill text-start "
                                        }>
                                        {item.id} - {item.name}
                                    </button>
                                </div>
                            );
                        })}
                    </div>

                    <div className="col-9">
                        {activeItem ? (
                            <ItemForm
                                item={activeItem}
                                collectionName={activeItemCollection}
                                onSave={handleSave}
                            />
                        ) : (
                            <div className="text-center">Select an item to edit</div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default EditItemsPage;
