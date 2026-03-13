import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
    useLocationEntities,
    useNeededForEntities,
    useHowToObtainEntities,
    useAddEntity,
    useUpdateEntity,
    useDeleteEntity,
} from "../../api/entities";
import { LoadingState, ErrorState } from "../../components/CommonStates";
import type { EntityOption } from "../../app/types/entityTypes";

export const Route = createFileRoute("/admin/entities")({
    component: EditEntitiesPage,
});

type EntityTableProps = {
    label: string;
    entityType: string;
    data: EntityOption[];
};

const emptyForm = { title: "", url: "", category: "" };

const EntityTable = ({ label, entityType, data }: EntityTableProps) => {
    const add = useAddEntity(entityType);
    const update = useUpdateEntity(entityType);
    const remove = useDeleteEntity(entityType);

    const [newForm, setNewForm] = useState(emptyForm);
    const [editId, setEditId] = useState<number | null>(null);
    const [editForm, setEditForm] = useState(emptyForm);

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newForm.title) return;
        add.mutate(
            { title: newForm.title, url: newForm.url, category: newForm.category || null },
            { onSuccess: () => setNewForm(emptyForm) }
        );
    };

    const startEdit = (entry: EntityOption) => {
        setEditId(entry.id);
        setEditForm({ title: entry.title, url: entry.url, category: entry.category ?? "" });
    };

    const handleUpdate = (id: number) => {
        update.mutate(
            {
                id,
                newItem: {
                    title: editForm.title,
                    url: editForm.url,
                    category: editForm.category || null,
                },
            },
            { onSuccess: () => setEditId(null) }
        );
    };

    return (
        <div className="mb-5">
            <h6 className="fw-bold">{label}</h6>
            <table className="table table-bordered table-sm align-middle">
                <thead className="table-dark">
                    <tr>
                        <th style={{ width: 40 }}>ID</th>
                        <th>Title</th>
                        <th>URL</th>
                        <th>Category</th>
                        <th style={{ width: 100 }}></th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((entry) =>
                        editId === entry.id ? (
                            <tr key={entry.id}>
                                <td className="text-muted small">{entry.id}</td>
                                <td>
                                    <input
                                        className="form-control form-control-sm"
                                        value={editForm.title}
                                        onChange={(e) =>
                                            setEditForm((f) => ({ ...f, title: e.target.value }))
                                        }
                                    />
                                </td>
                                <td>
                                    <input
                                        className="form-control form-control-sm"
                                        value={editForm.url}
                                        onChange={(e) =>
                                            setEditForm((f) => ({ ...f, url: e.target.value }))
                                        }
                                    />
                                </td>
                                <td>
                                    <input
                                        className="form-control form-control-sm"
                                        value={editForm.category}
                                        onChange={(e) =>
                                            setEditForm((f) => ({ ...f, category: e.target.value }))
                                        }
                                    />
                                </td>
                                <td>
                                    <button
                                        className="btn btn-sm btn-dark me-1"
                                        onClick={() => handleUpdate(entry.id)}
                                        disabled={update.isPending}>
                                        Save
                                    </button>
                                    <button
                                        className="btn btn-sm btn-outline-secondary"
                                        onClick={() => setEditId(null)}>
                                        ✕
                                    </button>
                                </td>
                            </tr>
                        ) : (
                            <tr key={entry.id}>
                                <td className="text-muted small">{entry.id}</td>
                                <td>{entry.title}</td>
                                <td className="text-truncate" style={{ maxWidth: 200 }}>
                                    <a href={entry.url} target="formurl">
                                        {entry.url}
                                    </a>
                                </td>
                                <td>{entry.category ?? ""}</td>
                                <td>
                                    <button
                                        className="btn btn-sm btn-outline-dark me-1"
                                        onClick={() => startEdit(entry)}>
                                        Edit
                                    </button>
                                    <button
                                        className="btn btn-sm btn-outline-danger"
                                        onClick={() => remove.mutate(entry.id)}
                                        disabled={remove.isPending}>
                                        Del
                                    </button>
                                </td>
                            </tr>
                        )
                    )}
                </tbody>
                <tfoot>
                    <tr>
                        <td></td>
                        <td>
                            <input
                                className="form-control form-control-sm"
                                placeholder="Title"
                                value={newForm.title}
                                onChange={(e) =>
                                    setNewForm((f) => ({ ...f, title: e.target.value }))
                                }
                            />
                        </td>
                        <td>
                            <input
                                className="form-control form-control-sm"
                                placeholder="URL"
                                value={newForm.url}
                                onChange={(e) => setNewForm((f) => ({ ...f, url: e.target.value }))}
                            />
                        </td>
                        <td>
                            <input
                                className="form-control form-control-sm"
                                placeholder="Category"
                                value={newForm.category}
                                onChange={(e) =>
                                    setNewForm((f) => ({ ...f, category: e.target.value }))
                                }
                            />
                        </td>
                        <td>
                            <button
                                className="btn btn-sm btn-dark"
                                onClick={handleAdd}
                                disabled={add.isPending || !newForm.title}>
                                Add
                            </button>
                        </td>
                    </tr>
                </tfoot>
            </table>
        </div>
    );
};

function EditEntitiesPage() {
    const { data: locationData, isLoading: l1, isError: e1, error: err1 } = useLocationEntities();
    const { data: neededForData, isLoading: l2, isError: e2, error: err2 } = useNeededForEntities();
    const {
        data: howToObtainData,
        isLoading: l3,
        isError: e3,
        error: err3,
    } = useHowToObtainEntities();

    if (l1 || l2 || l3) return <LoadingState color="dark" />;
    if (e1) return <ErrorState error={err1} />;
    if (e2) return <ErrorState error={err2} />;
    if (e3) return <ErrorState error={err3} />;

    return (
        <div className="container-fluid mt-2">
            <EntityTable label="Location" entityType="location_entity" data={locationData ?? []} />
            <EntityTable
                label="Needed For"
                entityType="needed_for_entity"
                data={neededForData ?? []}
            />
            <EntityTable
                label="How To Obtain"
                entityType="how_to_obtain_entity"
                data={howToObtainData ?? []}
            />
        </div>
    );
}
