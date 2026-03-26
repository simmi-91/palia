import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { selectAllCategories, useAddCategory, usePatchCategory } from "../../api/categories";
import { LoadingState, ErrorState } from "../../components/CommonStates";
import type { Category } from "../../app/types/wikiTypes";

export const Route = createFileRoute("/admin/categories")({
    component: EditCategoriesPage,
});

const InlinePatchField = ({
    category,
    field,
    type = "text",
}: {
    category: Category;
    field: keyof Pick<Category, "displayName" | "sortOrder">;
    type?: "text" | "number";
}) => {
    const patch = usePatchCategory();
    const [value, setValue] = useState<string>(String(category[field]));

    const handleBlur = () => {
        const parsed = type === "number" ? Number(value) : value;
        if (parsed !== category[field]) {
            patch.mutate({ id: category.id, data: { [field]: parsed } });
        }
    };

    return (
        <input
            className="form-control form-control-sm"
            type={type}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onBlur={handleBlur}
            style={{ minWidth: type === "number" ? 70 : 140 }}
        />
    );
};

const BoolToggle = ({
    category,
    field,
    label,
}: {
    category: Category;
    field: keyof Pick<Category, "isVisible" | "isTradeable" | "isFavoritable">;
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

const empty: Category = { id: "", displayName: "", isVisible: false, isTradeable: false, isFavoritable: false, sortOrder: 99 };

const AddCategoryForm = () => {
    const [form, setForm] = useState<Category>(empty);
    const add = useAddCategory();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.id || !form.displayName) return;
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
                    value={form.displayName}
                    onChange={(e) => setForm((f) => ({ ...f, displayName: e.target.value }))}
                    required
                />
            </div>
            <div className="col-auto">
                <input
                    className="form-control form-control-sm"
                    type="number"
                    placeholder="Order"
                    style={{ maxWidth: 80 }}
                    value={form.sortOrder}
                    onChange={(e) => setForm((f) => ({ ...f, sortOrder: Number(e.target.value) }))}
                />
            </div>
            <div className="col-auto form-check form-switch ms-2 mb-0">
                <input
                    className="form-check-input"
                    type="checkbox"
                    id="new-visible"
                    checked={form.isVisible}
                    onChange={(e) => setForm((f) => ({ ...f, isVisible: e.target.checked }))}
                />
                <label className="form-check-label" htmlFor="new-visible">Visible</label>
            </div>
            <div className="col-auto form-check form-switch mb-0">
                <input
                    className="form-check-input"
                    type="checkbox"
                    id="new-tradeable"
                    checked={form.isTradeable}
                    onChange={(e) => setForm((f) => ({ ...f, isTradeable: e.target.checked }))}
                />
                <label className="form-check-label" htmlFor="new-tradeable">Tradeable</label>
            </div>
            <div className="col-auto form-check form-switch mb-0">
                <input
                    className="form-check-input"
                    type="checkbox"
                    id="new-favoritable"
                    checked={form.isFavoritable}
                    onChange={(e) => setForm((f) => ({ ...f, isFavoritable: e.target.checked }))}
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
                        <th>Order</th>
                        <th>Visible</th>
                        <th>Tradeable</th>
                        <th>Favoritable</th>
                    </tr>
                </thead>
                <tbody>
                    {categories?.map((cat) => (
                        <tr key={cat.id}>
                            <td className="text-muted small">{cat.id}</td>
                            <td><InlinePatchField category={cat} field="displayName" /></td>
                            <td><InlinePatchField category={cat} field="sortOrder" type="number" /></td>
                            <td>
                                <BoolToggle category={cat} field="isVisible" label="Visible" />
                            </td>
                            <td>
                                <BoolToggle category={cat} field="isTradeable" label="Tradeable" />
                            </td>
                            <td>
                                <BoolToggle
                                    category={cat}
                                    field="isFavoritable"
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
