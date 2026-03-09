import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { LoadingState, ErrorState, EmptyCategoryState } from "../components/CommonStates";

import { selectAllCategories } from "../api/categories";

export const Route = createFileRoute("/wiki")({
    component: WikiLayout,
});

function WikiLayout() {
    const { data, isLoading, isError, error } = selectAllCategories();

    if (isLoading) return <LoadingState color="dark" />;
    if (isError) return <ErrorState error={error} />;
    if (!data || data.length === 0) return <EmptyCategoryState />;

    const categories = data.filter((cat) => cat.is_visible === true);

    return (
        <div className="container-fluid py-1">
            <div className=" d-flex flex-wrap gap-1">
                {categories.map((cat) => (
                    <Link
                        to="/wiki/$cat"
                        params={{ cat: cat.id }}
                        className={
                            "px-1 text-nowrap bg-light fs-5 text-black text-center text-decoration-none rounded border border-dark "
                        }
                        activeProps={{ className: "text-white bg-dark fw-bold" }}
                        style={{ minWidth: "80px" }}
                        key={cat.id}>
                        {cat.display_name}
                    </Link>
                ))}
            </div>
            <Outlet />
        </div>
    );
}
