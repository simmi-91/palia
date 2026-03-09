import React, { useState } from "react";
import { Formik, Form, Field, FieldArray, ErrorMessage, useFormikContext } from "formik";

import { createDynamicValidationSchema } from "../../utils/dynamicSchema";
import { CLOCK_PHASES, parseTimePhases, buildTimeString } from "../../utils/clockPhases";
import { getMultiListProps } from "../../utils/multilistProperties";

import type { EntityOption } from "../../app/types/entityTypes";
import type { MainItemEntry, MultilistProps } from "../../app/types/wikiTypes";
import { selectRarityByNumber } from "../../api/rarity";

import {
    useLocationEntities,
    useNeededForEntities,
    useHowToObtainEntities,
} from "../../api/entities";
import { useItemFamilies, useItemBehaviors, useItemBaits } from "../../api/items";
import { selectAllCategories } from "../../api/categories";

const NullableNumberField = ({ label, name }: { label: string; name: string }) => {
    const { values, setFieldValue } = useFormikContext<Record<string, unknown>>();
    return (
        <div className="input-group my-2 flex-column">
            <div className="input-group">
                <span className="input-group-text">{label}</span>
                <input
                    type="number"
                    className="form-control"
                    value={(values[name] as number | null) ?? ""}
                    onChange={(e) =>
                        setFieldValue(name, e.target.value === "" ? null : Number(e.target.value))
                    }
                />
            </div>
            <ErrorMessage name={name} component="div" className="text-danger small" />
        </div>
    );
};

const FormikInput = ({
    label,
    name,
    type = "text",
    step,
    required,
}: {
    label: string;
    name: string;
    type?: string;
    step?: string;
    required?: boolean;
}) => (
    <div className="input-group my-2 flex-column">
        <div className="input-group">
            <span className="input-group-text">{label}{required && <span className="text-danger ms-1">*</span>}</span>
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
                <span className="input-group-text">Wiki URL<span className="text-danger ms-1">*</span></span>
                <Field name="url" type="text" className="form-control" />
                <a
                    href={values.url || "#"}
                    target="formurl"
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
                        target="formurl"
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

const TimeCheckboxField = () => {
    const { values, setFieldValue, setFieldTouched } = useFormikContext<
        MainItemEntry & { time?: string }
    >();
    const selected = parseTimePhases(values.time ?? "");
    const allSelected = selected.length === CLOCK_PHASES.length;

    const toggle = (name: string) => {
        const next = selected.includes(name)
            ? selected.filter((s) => s !== name)
            : [...selected, name];
        setFieldValue("time", buildTimeString(next));
        setFieldTouched("time", true, false);
    };

    const toggleAll = () => {
        const next = allSelected ? [] : CLOCK_PHASES.map((p) => p.name);
        setFieldValue("time", buildTimeString(next));
        setFieldTouched("time", true, false);
    };

    return (
        <div className="my-2">
            <div className="d-flex flex-wrap align-items-center gap-3">
                <span className="input-group-text">Active Times</span>
                {CLOCK_PHASES.map((phase) => (
                    <div key={phase.name} className="form-check">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            id={`time-${phase.name}`}
                            checked={selected.includes(phase.name)}
                            onChange={() => toggle(phase.name)}
                        />
                        <label className="form-check-label" htmlFor={`time-${phase.name}`}>
                            {phase.name}
                        </label>
                    </div>
                ))}
                <div className="form-check">
                    <input
                        className="form-check-input"
                        type="checkbox"
                        id="time-any"
                        checked={allSelected}
                        onChange={toggleAll}
                    />
                    <label className="form-check-label" htmlFor="time-any">
                        Any Time
                    </label>
                </div>
            </div>
            <small className="text-muted">{values.time ?? ""}</small>
            <ErrorMessage name="time" component="div" className="text-danger small" />
        </div>
    );
};

const ComboField = ({ element }: { element: string }) => {
    const { data: behaviors = [] } = useItemBehaviors();
    const options = element === "behavior" ? behaviors : [];
    const label = element.charAt(0).toUpperCase() + element.slice(1);

    return (
        <div className="input-group my-2 flex-column">
            <div className="input-group">
                <span className="input-group-text">{label}</span>
                <Field name={element}>
                    {({
                        field,
                    }: {
                        field: {
                            name: string;
                            value: string;
                            onChange: React.ChangeEventHandler;
                            onBlur: React.FocusEventHandler;
                        };
                    }) => (
                        <>
                            <input
                                {...field}
                                list={`${element}-options`}
                                className="form-control"
                            />
                            <datalist id={`${element}-options`}>
                                {options.map((opt) => (
                                    <option key={opt} value={opt} />
                                ))}
                            </datalist>
                        </>
                    )}
                </Field>
            </div>
            <ErrorMessage name={element} component="div" className="text-danger small" />
        </div>
    );
};

const BaitRadioField = () => {
    const { data: options = [] } = useItemBaits();
    const { values, setFieldValue } = useFormikContext<MainItemEntry & { bait?: string | null }>();
    const isNull = values.bait === null || values.bait === undefined || values.bait === "";
    return (
        <div className="my-2">
            <div className="d-flex align-items-center gap-3">
                <span className="input-group-text">Bait</span>
                <div className="form-check form-check-inline">
                    <input
                        className="form-check-input"
                        type="radio"
                        id="bait-null"
                        name="bait"
                        checked={isNull}
                        onChange={() => setFieldValue("bait", null)}
                    />
                    <label className="form-check-label fst-italic" htmlFor="bait-null">
                        Not relevant
                    </label>
                </div>
                {options.map((opt) => (
                    <div key={opt} className="form-check form-check-inline">
                        <input
                            className="form-check-input"
                            type="radio"
                            id={`bait-${opt}`}
                            name="bait"
                            value={opt}
                            checked={values.bait === opt}
                            onChange={() => setFieldValue("bait", opt)}
                        />
                        <label className="form-check-label" htmlFor={`bait-${opt}`}>
                            {opt}
                        </label>
                    </div>
                ))}
            </div>
            <ErrorMessage name="bait" component="div" className="text-danger small" />
        </div>
    );
};

const CategoryField = () => {
    const { data: categories = [] } = selectAllCategories();
    return (
        <div className="input-group my-2 flex-column">
            <div className="input-group">
                <span className="input-group-text">Category<span className="text-danger ms-1">*</span></span>
                <Field name="category" as="select" className="form-select">
                    {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                            {cat.display_name}
                        </option>
                    ))}
                </Field>
            </div>
            <ErrorMessage name="category" component="div" className="text-danger small" />
        </div>
    );
};

const FamilyField = () => {
    const { data: families = [] } = useItemFamilies();
    return (
        <div className="input-group my-2 flex-column">
            <div className="input-group">
                <span className="input-group-text">Family</span>
                <Field name="family">
                    {({
                        field,
                    }: {
                        field: {
                            name: string;
                            value: string;
                            onChange: React.ChangeEventHandler;
                            onBlur: React.FocusEventHandler;
                        };
                    }) => (
                        <>
                            <input {...field} list="family-options" className="form-control" />
                            <datalist id="family-options">
                                {families.map((f) => (
                                    <option key={f} value={f} />
                                ))}
                            </datalist>
                        </>
                    )}
                </Field>
            </div>
            <ErrorMessage name="family" component="div" className="text-danger small" />
        </div>
    );
};

const genericFields = (keys: string[]) => {
    const skipKey = ["id", "name", "image", "url"];
    return (
        <>
            <FormikInput label="Name" name="name" required />
            <UrlField />
            <ImgField />

            <div className="row ">
                {keys.map((element) => {
                    if (skipKey.includes(element)) {
                        return null;
                    }
                    if (element === "rarity") {
                        return <RarityField key={element} />;
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
                        return <NullableNumberField key={element} label="Base Value" name="baseValue" />;
                    if (element === "time") return <TimeCheckboxField key={element} />;
                    if (element === "behavior")
                        return <ComboField key={element} element={element} />;
                    if (element === "bait") return <BaitRadioField key={element} />;
                    if (element === "category") return <CategoryField key={element} />;
                    if (element === "family") return <FamilyField key={element} />;
                    {
                        const label = element
                            .replace(/([A-Z])/g, " $1")
                            .replace(/^./, (s) => s.toUpperCase());
                        return <FormikInput key={element} label={label} name={element} />;
                    }
                })}
            </div>
        </>
    );
};

const MultiFieldsArray = ({ title, allOptions }: { title: string; allOptions: EntityOption[] }) => {
    const name = toAllEntityKey(title);
    const { values } = useFormikContext<MainItemEntry & Record<string, MultilistProps["list"]>>();
    const list: MultilistProps["list"] =
        ((values as Record<string, unknown>)[name] as MultilistProps["list"]) ?? [];

    const [selectedTitle, setSelectedTitle] = useState("");

    const selectedTitles = new Set(list.map((item) => item.title));
    const unselectedOptions = allOptions.filter((option) => !selectedTitles.has(option.title));

    return (
        <div className="card my-2 shadow" key={name}>
            <h5 className="card-header">{title} (Link Table)</h5>
            <div className="card-body">
                <FieldArray name={name}>
                    {({ push, remove }) => (
                        <>
                            <div>
                                {list.length === 0 ? (
                                    <span className="fst-italic">Empty list</span>
                                ) : null}
                                {list?.map((item, index: number) => (
                                    <div
                                        key={index}
                                        className="d-flex justify-content-between align-items-center border p-2 mb-2">
                                        <span className="fw-bold">{item.title}</span>
                                        <a
                                            href={item.url}
                                            target="formurl"
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
                            </div>
                            <div className="d-flex gap-2">
                                {unselectedOptions.length > 0 && (
                                    <select
                                        className="form-select mt-2 w-auto"
                                        value={selectedTitle}
                                        onChange={(e) => setSelectedTitle(e.target.value)}>
                                        <option value="">Select a new {title}...</option>
                                        {unselectedOptions.map((option) => (
                                            <option key={option.id} value={option.title}>
                                                {option.category
                                                    ? `[${option.category[0]}] ${option.title}`
                                                    : option.title}
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
                        </>
                    )}
                </FieldArray>
                <ErrorMessage name={name}>
                    {(msg) =>
                        typeof msg === "string" ? (
                            <div className="text-danger small mt-2">{msg}</div>
                        ) : null
                    }
                </ErrorMessage>
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
    onDelete,
}: {
    item: MainItemEntry;
    collectionName: string;
    onSave: (values: MainItemEntry) => Promise<void>;
    onDelete?: (id: number) => Promise<void>;
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
            key={item.id}
            initialValues={initialValues}
            validationSchema={validationSchema}
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
            {({ values, status, isSubmitting }) => (
                <Form>
                    <div className="container">
                        <div className="card my-2 shadow">
                            <h5 className="card-header">
                                {values.id === 0
                                    ? "New Item"
                                    : `Editing id ${values.id}, ${values.name}`}
                            </h5>
                            <div className="card-body">
                                {genericFields(genericKeys)}
                                <small className="text-muted"><span className="text-danger">*</span> Required</small>
                            </div>
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
                            {status?.success && (
                                <div className="alert alert-success m-2">
                                    {values.id === 0 ? "Item added!" : "Changes saved!"}
                                </div>
                            )}
                            {status?.error && (
                                <div className="alert alert-danger m-2">{status.error}</div>
                            )}

                            <div className="d-flex gap-2">
                                <button
                                    type="submit"
                                    className="btn btn-success"
                                    disabled={isSubmitting}>
                                    {values.id === 0 ? "Add Item" : "Save Changes"}
                                </button>
                                {values.id !== 0 && onDelete && (
                                    <button
                                        type="button"
                                        className="btn btn-danger"
                                        disabled={isSubmitting}
                                        onClick={async () => {
                                            if (
                                                !confirm(
                                                    `Delete "${values.name}"? This cannot be undone.`
                                                )
                                            )
                                                return;
                                            try {
                                                await onDelete(values.id);
                                            } catch (err) {
                                                alert(
                                                    err instanceof Error
                                                        ? err.message
                                                        : "Delete failed"
                                                );
                                            }
                                        }}>
                                        Delete
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </Form>
            )}
        </Formik>
    );
};

export default ItemForm;
