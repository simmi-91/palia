import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "../../context/AuthContext";
import { useState, useEffect } from "react";
import CustomCard from "../../components/display/CustomCard";
import { LoadingState, ErrorState, EmptyCategoryState } from "../../components/CommonStates";
import { selectItemsByCategory } from "../../api/items";
import { selectAllCategories } from "../../api/categories";
import { selectFavoritesByCategory } from "../../api/favorites";
import ItemFilters from "../../components/ItemFilters";

export const Route = createFileRoute("/wiki/category/$cat")({
    component: WikiCategoryPage,
});

function WikiCategoryPage() {
    const { cat } = Route.useParams();

    const { profile } = useAuth();
    const profileId = profile ? profile.id : "";

    const { data, isLoading, isError, error } = selectItemsByCategory(cat);
    const { data: favoritesData, isLoading: favLoad } = selectFavoritesByCategory(profileId, cat);
    const { data: categoryData } = selectAllCategories();

    const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});
    useEffect(() => {
        setActiveFilters({});
    }, [cat]);

    const [filteredData, setFilteredData] = useState(data ? [...data] : []);
    useEffect(() => {
        if (data) {
            let localData = [...data];

            for (const [filterType, selected] of Object.entries(activeFilters)) {
                if (selected && selected !== "all") {
                    localData = localData.filter((item) => {
                        const itemValue = (item as Record<string, unknown>)[filterType];
                        return String(itemValue) === selected;
                    });
                }
            }
            setFilteredData(localData);
        }
    }, [data, activeFilters]);

    if (isLoading || favLoad) return <LoadingState color="dark" />;
    if (isError) return <ErrorState error={error} />;
    if (!data || data.length === 0) return <EmptyCategoryState />;

    return (
        <div className="container-fluid">
            <div className="row mt-2">
                <div className="col">
                    <ItemFilters data={data} activeFilters={activeFilters} onChange={setActiveFilters} />
                </div>
            </div>

            <div className="row d-flex g-2 my-2">
                {filteredData.map((item) => {
                    const favId = favoritesData?.find((f) => f.itemId === item.id)?.favoriteId ?? 0;
                    return (
                        <CustomCard
                            category={cat}
                            key={item.id}
                            dataObject={item}
                            isTradeable={
                                categoryData?.find((c) => c.id === cat)?.is_tradeable ?? false
                            }
                            isFavoritable={
                                categoryData?.find((c) => c.id === cat)?.is_favoritable ?? false
                            }
                            favoriteId={favId}
                        />
                    );
                })}
            </div>
        </div>
    );
}
