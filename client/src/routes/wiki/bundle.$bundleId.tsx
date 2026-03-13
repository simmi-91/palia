import { createFileRoute } from "@tanstack/react-router";
import CustomCard from "../../components/display/CustomCard";
import { LoadingState, ErrorState, EmptyCategoryState } from "../../components/CommonStates";
import { selectItemsByNeededFor } from "../../api/items";
import { useNeededForEntities } from "../../api/entities";

export const Route = createFileRoute("/wiki/bundle/$bundleId")({
    component: WikiBundlePage,
});

function WikiBundlePage() {
    const { bundleId } = Route.useParams();

    const { data: neededForData } = useNeededForEntities();
    const bundle = neededForData?.find((e) => String(e.id) === bundleId);

    const { data, isLoading, isError, error } = selectItemsByNeededFor(bundle?.title ?? "");

    if (isLoading) return <LoadingState color="dark" />;
    if (isError) return <ErrorState error={error} />;
    if (!bundle) return <LoadingState color="dark" />;
    if (!data || data.length === 0) return <EmptyCategoryState />;

    return (
        <div className="container-fluid">
            <div className="row mt-2">
                <div className="col">
                    <h5>
                        <a
                            href={bundle.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-black text-decoration-none link-primary">
                            {bundle.title}
                        </a>
                    </h5>
                </div>
            </div>
            <div className="row d-flex g-2 my-2">
                {data.map((item) => (
                    <CustomCard
                        key={item.id}
                        category={item.category}
                        dataObject={item}
                        isTradeable={false}
                        isFavoritable={false}
                        favoriteId={0}
                    />
                ))}
            </div>
        </div>
    );
}
