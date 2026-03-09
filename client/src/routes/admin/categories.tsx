import { createFileRoute } from "@tanstack/react-router";
import { selectAllCategories, usePatchCategory } from "../../api/categories";
import { LoadingState, ErrorState } from "../../components/CommonStates";
import type { CategoryEntry } from "../../app/types/wikiTypes";

export const Route = createFileRoute("/admin/categories")({
    component: EditCategoriesPage,
});

const BoolToggle = ({
    category,
    field,
    label,
}: {
    category: CategoryEntry;
    field: keyof Pick<CategoryEntry, "is_visible" | "is_tradeable" | "is_favoritable">;
    label: string;
}) => {
    const patch = usePatchCategory();
    return (
        <div className="form-check form-switch">
            <input
                className="form-check-input"
                type="checkbox"
                id={`${category.id}-${field}`}
                checked={category[field]}
                onChange={(e) =>
                    patch.mutate({ id: category.id, data: { [field]: e.target.checked } })
                }
            />
            <label className="form-check-label" htmlFor={`${category.id}-${field}`}>
                {label}
            </label>
        </div>
    );
};

function EditCategoriesPage() {
    const { data: categories, isLoading, isError, error } = selectAllCategories();

    if (isLoading) return <LoadingState color="dark" />;
    if (isError) return <ErrorState error={error} />;

    return (
        <div className="container-fluid mt-2">
            <table className="table table-bordered table-sm align-middle">
                <thead className="table-dark">
                    <tr>
                        <th>ID</th>
                        <th>Display name</th>
                        <th>Visible</th>
                        <th>Tradeable</th>
                        <th>Favoritable</th>
                    </tr>
                </thead>
                <tbody>
                    {categories?.map((cat) => (
                        <tr key={cat.id}>
                            <td className="text-muted small">{cat.id}</td>
                            <td>{cat.display_name}</td>
                            <td>
                                <BoolToggle category={cat} field="is_visible" label="Visible" />
                            </td>
                            <td>
                                <BoolToggle category={cat} field="is_tradeable" label="Tradeable" />
                            </td>
                            <td>
                                <BoolToggle
                                    category={cat}
                                    field="is_favoritable"
                                    label="Favoritable"
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
