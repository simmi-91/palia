import { useState } from "react";
import { Formik, Form, Field, FieldArray, ErrorMessage, useFormikContext } from "formik";
import { createDynamicValidationSchema } from "../../utils/dynamicSchema";

import type { EntityOption } from "../../app/types/entityTypes";
import type { MainItemEntry, MultilistProps } from "../../app/types/wikiTypes";
import { getMultiListProps } from "../../utils/multilistProperties";
import { selectRarityByNumber } from "../../features/slices/RaritySlice";

import {
    useLocationEntities,
    useNeededForEntities,
    useHowToObtainEntities,
} from "../../features/slices/EntitySlice";

const FormikInput = ({
    label,
    name,
    type = "text",
    step,
}: {
    label: string;
    name: string;
    type?: string;
    step?: string;
}) => (
    <div className="input-group my-2 flex-column">
        <div className="input-group">
            <span className="input-group-text">{label}</span>
            <Field name={name} type={type} step={step} className="form-control" />
        </div>
        <ErrorMessage name={name} component="div" className="text-danger small" />
    </div>
);

const UrlField = () => {
    const { values } = useFormikContext<MainItemEntry>();
    return (
        <div className="input-group my-2 flex-column">
            <div className="input-group">
                <span className="input-group-text">Wiki URL</span>
                <Field name="url" type="text" className="form-control" />
                <a
                    href={values.url || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn border-secondary-subtle"
                    tabIndex={-1}>
                    <i className="bi bi-box-arrow-up-right" />
                </a>
            </div>
            <ErrorMessage name="url" component="div" className="text-danger small" />
        </div>
    );
};

const ImgField = () => {
    const { values } = useFormikContext<MainItemEntry>();
    return (
        <div className="input-group my-2 flex-column">
            <div className="input-group">
                <span className="input-group-text">Image URL</span>
                <Field name="image" type="text" className="form-control" />
                {values.image && (
                    <a
                        href={values.image}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn border-secondary-subtle p-0 overflow-hidden"
                        tabIndex={-1}>
                        <img src={values.image} alt="" height={40} style={{ display: "block" }} />
                    </a>
                )}
            </div>
            <ErrorMessage name="image" component="div" className="text-danger small" />
        </div>
    );
    //<FormikInput key={element} label="Image URL" name="image" />
};

const RarityField = () => {
    return (
        <div className="my-2">
            <div className="d-flex align-items-center gap-2">
                <span className="input-group-text">Rarity</span>
                <RarityNameDisplay />
                <Field name="rarity" type="range" min="1" max="6" className="form-range" />
                <Field
                    name="rarity"
                    type="number"
                    className="form-control w-auto"
                    style={{ maxWidth: "60px" }}
                />
            </div>
            <ErrorMessage name="rarity" component="div" className="text-danger small" />
        </div>
    );
};

const RarityNameDisplay = () => {
    const { values } = useFormikContext<MainItemEntry & { rarity?: number }>();
    if (values.rarity === undefined) return null;
    const rarity = selectRarityByNumber(values.rarity);
    return (
        <span className="form-control w-auto" style={{ maxWidth: "120px" }}>
            {rarity?.name ?? "—"}
        </span>
    );
};

const genericFields = (keys: string[]) => {
    const skipKey = ["id", "name", "image", "url"];
    return (
        <>
            <FormikInput label="Name" name="name" />
            <UrlField />
            <ImgField />

            <div className="row ">
                {keys.map((element) => {
                    if (skipKey.includes(element)) {
                        return null;
                    }
                    if (element === "rarity") {
                        return <RarityField key={element} />;
                        /*return (
                            <div key={element} className="d-inline-flex align-items-center mb-3">
                                <label htmlFor="rarity" className="form-label pe-2">
                                    Rarity
                                </label>
                                <RarityNameDisplay />
                                <Field
                                    name="rarity"
                                    type="range"
                                    min="1"
                                    max="6"
                                    className="form-range mx-2"
                                />
                                <Field
                                    name="rarity"
                                    type="number"
                                    className="form-control w-auto"
                                    style={{ maxWidth: "60px" }}
                                />
                                <ErrorMessage
                                    name="rarity"
                                    component="div"
                                    className="text-danger small"
                                />
                            </div>
                        );*/
                    }
                    if (element === "description")
                        return (
                            <FormikInput
                                key={element}
                                label="Description"
                                name="description"
                                type="textarea"
                            />
                        );
                    if (element === "baseValue")
                        return <FormikInput key={element} label="Base Value" name="baseValue" />;
                    if (element === "time")
                        return <FormikInput key={element} label="Time" name="time" />;
                    if (element === "behavior")
                        return <FormikInput key={element} label="Behavior" name="behavior" />;
                    return null;
                })}
            </div>
        </>
    );
};

const MultiFieldsArray = ({
    title,
    allOptions,
}: {
    title: string;
    allOptions: EntityOption[];
}) => {
    const name = toAllEntityKey(title);
    const { values } = useFormikContext<MainItemEntry & Record<string, MultilistProps["list"]>>();
    const list: MultilistProps["list"] = (values as Record<string, unknown>)[name] as MultilistProps["list"] ?? [];

    const [selectedTitle, setSelectedTitle] = useState("");

    const selectedTitles = new Set(list.map((item) => item.title));
    const unselectedOptions = allOptions.filter((option) => !selectedTitles.has(option.title));

    return (
        <div className="card my-2 shadow" key={name}>
            <h5 className="card-header">{title} (Link Table)</h5>
            <div className="card-body">
                <FieldArray name={name}>
                    {({ push, remove }) => (
                        <div>
                            {list?.map((item, index: number) => (
                                <div
                                    key={index}
                                    className="d-flex justify-content-between align-items-center border p-2 mb-2">
                                    <span className="fw-bold">{item.title}</span>
                                    <a
                                        href={item.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="ms-3 small text-truncate">
                                        {item.url}
                                    </a>
                                    <button
                                        type="button"
                                        className="btn btn-danger btn-sm ms-auto"
                                        onClick={() => remove(index)}>
                                        Remove
                                    </button>
                                </div>
                            ))}

                            {unselectedOptions.length > 0 && (
                                <select
                                    className="form-select mt-2 w-auto"
                                    value={selectedTitle}
                                    onChange={(e) => setSelectedTitle(e.target.value)}>
                                    <option value="">Select a new {title}...</option>
                                    {unselectedOptions.map((option) => (
                                        <option key={option.id} value={option.title}>
                                            {option.title}
                                        </option>
                                    ))}
                                </select>
                            )}

                            <button
                                type="button"
                                className="btn btn-primary btn-sm mt-2"
                                onClick={() => {
                                    if (!selectedTitle) return;

                                    const entityToAdd = allOptions.find(
                                        (opt) => opt.title === selectedTitle
                                    );

                                    if (entityToAdd) {
                                        push({
                                            title: entityToAdd.title,
                                            url: entityToAdd.url,
                                            category: entityToAdd.category || "",
                                        });
                                        setSelectedTitle("");
                                    }
                                }}
                                disabled={unselectedOptions.length === 0}>
                                Add Selected {title}
                            </button>
                        </div>
                    )}
                </FieldArray>
                <ErrorMessage name={name} component="div" className="text-danger small mt-2" />
            </div>
        </div>
    );
};

type AllEntityMap = {
    location: EntityOption[];
    neededFor: EntityOption[];
    howToObtain: EntityOption[];
};

const toAllEntityKey = (title: string): keyof AllEntityMap => {
    const words = title.trim().split(/\s+/);
    const key = words
        .map((w, i) =>
            i === 0 ? w.toLowerCase() : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()
        )
        .join("");
    return key as keyof AllEntityMap;
};

const ItemForm = ({
    item,
    collectionName: _collectionName,
    onSave,
}: {
    item: MainItemEntry;
    collectionName: string;
    onSave: (values: MainItemEntry) => Promise<void>;
}) => {
    const { data: locationData } = useLocationEntities();
    const { data: neededForData } = useNeededForEntities();
    const { data: howToObtainData } = useHowToObtainEntities();

    const allOptionsMap: AllEntityMap = {
        location: locationData ?? [],
        neededFor: neededForData ?? [],
        howToObtain: howToObtainData ?? [],
    };

    const multilist = getMultiListProps(item, undefined, true);

    const initialValues = item;
    const validationSchema = createDynamicValidationSchema(item);

    const genericKeys = Object.keys(item).filter((key) => {
        return !Array.isArray(item[key as keyof MainItemEntry]);
    });

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            enableReinitialize={true}
            onSubmit={async (values, { setSubmitting, setStatus }) => {
                try {
                    await onSave(values as MainItemEntry);
                    setStatus({ success: true });
                } catch (err) {
                    setStatus({
                        error: err instanceof Error ? err.message : "Save failed",
                    });
                } finally {
                    setSubmitting(false);
                }
            }}>
            {({ values, errors, touched, status }) => (
                <Form>
                    <div className="container">
                        <div className="card my-2 shadow">
                            <h5 className="card-header">
                                Editing id {values.id}, {values.name}
                            </h5>
                            <div className="card-body">{genericFields(genericKeys)}</div>
                        </div>

                        {multilist &&
                            multilist.length > 0 &&
                            multilist.map((multiItem) => (
                                <MultiFieldsArray
                                    key={multiItem.title}
                                    title={multiItem.title}
                                    allOptions={
                                        allOptionsMap[toAllEntityKey(multiItem.title)] ?? []
                                    }
                                />
                            ))}

                        <div className="row mt-3">
                            <button
                                type="submit"
                                className="btn btn-success"
                                disabled={
                                    Object.keys(errors).length > 0 &&
                                    Object.keys(touched).length > 0
                                }>
                                Save Changes
                            </button>
                            {status?.success && (
                                <div className="alert alert-success mt-2">Changes saved!</div>
                            )}
                            {status?.error && (
                                <div className="alert alert-danger mt-2">{status.error}</div>
                            )}
                        </div>
                    </div>
                </Form>
            )}
        </Formik>
    );
};

export default ItemForm;
