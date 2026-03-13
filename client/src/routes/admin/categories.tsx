import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { selectAllCategories, useAddCategory, usePatchCategory } from "../../api/categories";
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

const empty: CategoryEntry = { id: "", display_name: "", is_visible: false, is_tradeable: false, is_favoritable: false };

const AddCategoryForm = () => {
    const [form, setForm] = useState<CategoryEntry>(empty);
    const add = useAddCategory();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.id || !form.display_name) return;
        add.mutate(form, { onSuccess: () => setForm(empty) });
    };

    return (
        <form className="row g-2 align-items-center mb-3" onSubmit={handleSubmit}>
            <div className="col-auto">
                <input
                    className="form-control form-control-sm"
                    placeholder="ID (e.g. bugs)"
                    value={form.id}
                    onChange={(e) => setForm((f) => ({ ...f, id: e.target.value }))}
                    required
                />
            </div>
            <div className="col-auto">
                <input
                    className="form-control form-control-sm"
                    placeholder="Display name"
                    value={form.display_name}
                    onChange={(e) => setForm((f) => ({ ...f, display_name: e.target.value }))}
                    required
                />
            </div>
            <div className="col-auto form-check form-switch ms-2 mb-0">
                <input
                    className="form-check-input"
                    type="checkbox"
                    id="new-visible"
                    checked={form.is_visible}
                    onChange={(e) => setForm((f) => ({ ...f, is_visible: e.target.checked }))}
                />
                <label className="form-check-label" htmlFor="new-visible">Visible</label>
            </div>
            <div className="col-auto form-check form-switch mb-0">
                <input
                    className="form-check-input"
                    type="checkbox"
                    id="new-tradeable"
                    checked={form.is_tradeable}
                    onChange={(e) => setForm((f) => ({ ...f, is_tradeable: e.target.checked }))}
                />
                <label className="form-check-label" htmlFor="new-tradeable">Tradeable</label>
            </div>
            <div className="col-auto form-check form-switch mb-0">
                <input
                    className="form-check-input"
                    type="checkbox"
                    id="new-favoritable"
                    checked={form.is_favoritable}
                    onChange={(e) => setForm((f) => ({ ...f, is_favoritable: e.target.checked }))}
                />
                <label className="form-check-label" htmlFor="new-favoritable">Favoritable</label>
            </div>
            <div className="col-auto">
                <button className="btn btn-sm btn-dark" type="submit" disabled={add.isPending}>
                    Add category
                </button>
            </div>
            {add.isError && <div className="col-auto text-danger small">{add.error?.message}</div>}
        </form>
    );
};

function EditCategoriesPage() {
    const { data: categories, isLoading, isError, error } = selectAllCategories();

    if (isLoading) return <LoadingState color="dark" />;
    if (isError) return <ErrorState error={error} />;

    return (
        <div className="container-fluid mt-2">
            <AddCategoryForm />
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
