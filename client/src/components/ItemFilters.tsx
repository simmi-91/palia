import { useMemo } from "react";
import type { Item } from "../app/types/wikiTypes";
import { selectRarityByNumber } from "../api/rarity";

const FILTER_TYPES = ["family", "behavior", "rarity", "time"];

type ItemFiltersProps = {
    data: Item[];
    activeFilters: Record<string, string>;
    onChange: (filters: Record<string, string>) => void;
};

const ItemFilters = ({ data, activeFilters, onChange }: ItemFiltersProps) => {
    const localFilters = useMemo(() => {
        return FILTER_TYPES.reduce((acc: Record<string, string[]>, filterType) => {
            const values = data
                .map((item) => (item as Record<string, unknown>)[filterType])
                .filter((v) => v !== null && v !== undefined && v !== "");
            if (values.length > 0) acc[filterType] = [...new Set(values as string[])];
            return acc;
        }, {});
    }, [data]);

    if (Object.keys(localFilters).length === 0) return null;

    return (
        <div className="d-flex flex-wrap align-items-center gap-2">
            {Object.entries(localFilters).map(([filterType, options]) => (
                <select
                    key={filterType}
                    className="form-select form-select-sm w-auto"
                    value={activeFilters[filterType] ?? "all"}
                    onChange={(e) =>
                        onChange({ ...activeFilters, [filterType]: e.target.value })
                    }>
                    <option value="all">All {filterType}</option>
                    {options.map((option) => (
                        <option key={option} value={option}>
                            {filterType === "rarity"
                                ? (selectRarityByNumber(Number(option))?.name ?? option)
                                : option}
                        </option>
                    ))}
                </select>
            ))}
        </div>
    );
};

export default ItemFilters;
