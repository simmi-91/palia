import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { LoadingState, ErrorState, EmptyCategoryState } from "../components/CommonStates";

import { selectAllCategories } from "../api/categories";
import { useNeededForEntities } from "../api/entities";

export const Route = createFileRoute("/wiki")({
    component: WikiLayout,
});

const linkClass =
    "px-1 text-nowrap bg-light text-black text-center text-decoration-none rounded border border-dark ";
const activeLinkClass = "text-white bg-dark fw-bold";

function WikiLayout() {
    const { data, isLoading, isError, error } = selectAllCategories();
    const { data: neededForData } = useNeededForEntities();

    if (isLoading) return <LoadingState color="dark" />;
    if (isError) return <ErrorState error={error} />;
    if (!data || data.length === 0) return <EmptyCategoryState />;

    const categories = data.filter((cat) => cat.isVisible === true);
    const bundles =
        neededForData
            ?.filter((e) => e.title.includes("Bundle"))
            .sort((a, b) => a.title.localeCompare(b.title)) ?? [];

    return (
        <div className="container-fluid py-1">
            <div className="d-flex flex-wrap gap-1 mb-1">
                {categories.map((cat) => (
                    <Link
                        to="/wiki/category/$cat"
                        params={{ cat: cat.id }}
                        className={`${linkClass}  fs-5`}
                        activeProps={{ className: activeLinkClass }}
                        style={{ minWidth: "80px" }}
                        key={cat.id}>
                        {cat.displayName}
                    </Link>
                ))}
            </div>
            {bundles.length > 0 && (
                <div className="d-flex flex-wrap gap-1 mb-1">
                    {bundles.map((bundle) => (
                        <Link
                            to="/wiki/bundle/$bundleId"
                            params={{ bundleId: String(bundle.id) }}
                            className={`${linkClass}  fs-6`}
                            activeProps={{ className: activeLinkClass }}
                            style={{ minWidth: "80px" }}
                            key={bundle.id}>
                            {bundle.title}
                        </Link>
                    ))}
                </div>
            )}
            <Outlet />
        </div>
    );
}
