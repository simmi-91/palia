import { useAuth } from "../../context/AuthContext";
import { useState } from "react";

import Tag from "./Tag";
import RarityTag from "./RarityTag";
import missingImg from "../../assets/images/missing.png";
import { getMultiListProps } from "../../utils/multilistProperties";
import { parseTimePhases } from "../../utils/clockPhases";
import { useAddFavorite, useRemoveFavorite } from "../../hooks/useFavoriteMutations";
import type { Item, EntityLink, EntityLinkList } from "../../app/types/wikiTypes";
import { textIcon, urlWorm, urlGlowWorm } from "../../app/icons/common";

const baitIconMap: Record<string, string> = {
    Worm: urlWorm,
    "Glow Worm": urlGlowWorm,
};

type CustomCardProps = {
    dataObject: Item;
    category: string; // Passed from parent (e.g., 'artifacts', 'plushies')
    isTradeable: boolean;
    isFavoritable: boolean;
    favoriteId: number;
};

const CustomCard: React.FC<CustomCardProps> = ({
    dataObject,
    category,
    isTradeable,
    isFavoritable,
    favoriteId,
}) => {
    const id = dataObject.id;
    const name = dataObject.name;
    const [isFavorited, setIsFavorited] = useState(favoriteId > 0);

    const { profile, inventory, updateInventoryAmount } = useAuth();
    const profileId = profile ? profile.id : "";
    const { add: addFavoriteMutate, isPending: addingFav } = useAddFavorite(profileId);
    const { remove: removeFavoriteMutate, isPending: removingFav } = useRemoveFavorite(profileId);

    const currentItem = inventory?.find(
        (item) => item.itemId === dataObject.id && item.category === category
    );
    const currentAmount = currentItem ? currentItem.amount : 0;

    const showInventoryControls = isTradeable && profileId != "";
    const showFavoriteControls = isFavoritable && profileId != "";

    let imgUrl = missingImg;
    if ("image" in dataObject && dataObject.image && dataObject.image != "") {
        imgUrl = dataObject.image;
    }

    const rarity = dataObject.rarity ?? 0;
    const bait = dataObject.bait ?? "";
    const family = dataObject.family ?? "";
    const time = parseTimePhases(dataObject.time ?? "").join(", ") ?? "";

    const multiList = getMultiListProps(dataObject);
    const hasEntityLinks = multiList && multiList.length > 0;

    let wikiUrl = dataObject.url || "";
    let baseUrl = "";
    try {
        if (wikiUrl) {
            const url = new URL(wikiUrl);
            baseUrl = url.origin;
        }
    } catch (error) {
        console.error("Invalid URL format:", wikiUrl, error);
        baseUrl = "";
    }

    const maxAmount = 99;
    const handleIncrement = () => {
        const inventoryUpdate = {
            category: category,
            itemId: id,
            amount: currentAmount + 1,
        };
        if (currentAmount < maxAmount) {
            updateInventoryAmount(inventoryUpdate);
        }
    };

    const handleDecrement = () => {
        const inventoryUpdate = {
            category: category,
            itemId: id,
            amount: currentAmount - 1,
        };
        if (currentAmount > 0) {
            updateInventoryAmount(inventoryUpdate);
        }
    };

    const handleFavorite = () => {
        if (!profileId) return;
        try {
            if (isFavorited) {
                removeFavoriteMutate(
                    { favoriteId },
                    {
                        onSuccess: () => setIsFavorited(false),
                    }
                );
            } else {
                addFavoriteMutate(
                    { category, itemId: id },
                    {
                        onSuccess: () => setIsFavorited(true),
                    }
                );
            }
        } catch (e) {
            console.error("Failed to edit favorite state", e);
        }
    };

    const renderEntityLinks = () => {
        return (
            <div
                className={`col d-flex ${multiList.length > 1 && (showInventoryControls || showFavoriteControls) ? "flex-column flex-xxl-row" : ""}`}>
                {multiList.map((group: EntityLinkList) => (
                    <div key={group.title.replace(/\s/g, "").toLowerCase()} className="row">
                        <b className="text-s">{group.title}:</b>
                        <div className="d-flex flex-wrap">
                            {group.list.map((entityLink: EntityLink, idx: number) => {
                                let icon = "";
                                if (entityLink.category === "Bug Catching") {
                                    icon = "bi-bug-fill";
                                } else if (entityLink.category === "Fishing") {
                                    icon = "bi-droplet-fill";
                                } else if (entityLink.category === "Hunting") {
                                    icon = "bi-heart-arrow";
                                } else if (entityLink.category === "Rummage Pile") {
                                    icon = "bi-virus";
                                }

                                return (
                                    <Tag
                                        key={`${id}-${entityLink.url}-${idx}`}
                                        text={entityLink.title}
                                        title={entityLink.category}
                                        icon={icon}
                                        wrap={true}
                                    />
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    const renderInventory = () => {
        return (
            <>
                <b className="text-s">Inventory:</b>
                <div className="input-group mb-1 flex-nowrap">
                    <button
                        type="button"
                        className="btn btn-outline-secondary rounded fw-bold"
                        style={{
                            minWidth: 40,
                            width: 40,
                            height: 40,
                        }}
                        onClick={handleDecrement}
                        disabled={currentAmount <= 0}>
                        -
                    </button>
                    <input
                        className="form-control mx-1 rounded border border-1 border-secondary "
                        placeholder="0"
                        aria-label="number"
                        style={{
                            minWidth: 40,
                            maxWidth: 65,
                            height: 40,
                            background: "rgba(225, 225, 225, 0.3",
                        }}
                        value={currentAmount}
                        readOnly></input>
                    <button
                        type="button"
                        className="btn btn-outline-secondary rounded fw-bold"
                        style={{
                            minWidth: 40,
                            width: 40,
                            height: 40,
                        }}
                        onClick={handleIncrement}
                        disabled={currentAmount >= maxAmount}>
                        +
                    </button>
                </div>
            </>
        );
    };

    const renderFavorite = () => {
        return (
            <>
                <div className="input-group mb-1 flex-nowrap justify-content-end align-top">
                    <button
                        type="button"
                        className="btn  btn-outline-dark rounded fw-bold p-0 m-0"
                        style={{
                            minWidth: 40,
                            width: 40,
                            height: 40,
                        }}
                        onClick={handleFavorite}
                        disabled={addingFav || removingFav}>
                        {isFavorited ? (
                            <i
                                className="bi bi-star-fill fs-5"
                                style={{
                                    WebkitTextStrokeWidth: "2px",
                                    WebkitTextStrokeColor: "black",
                                    color: "yellow",
                                }}></i>
                        ) : (
                            <i className="bi bi-star"></i>
                        )}
                    </button>
                </div>
            </>
        );
    };

    return (
        <div key={id} className="col-12 col-sm-6 col-lg-4 col-xl-3 d-flex">
            <div
                className="container border border-1 rounded-3 d-flex flex-column"
                style={{
                    background:
                        "linear-gradient(180deg,rgba(226, 229, 233, 1) 0%, rgba(226, 229, 233, 0.9) 40%, rgba(46, 127, 233, 0.5) 100%",
                }}>
                <div className="row py-1 flex-fill">
                    <div className="col d-flex row flex-column">
                        <h5 className="card-title">
                            {baseUrl ? (
                                <a
                                    href={dataObject.url}
                                    target={category}
                                    title={`Go to wiki page, ${baseUrl}`}
                                    className="text-black text-decoration-none link-primary">
                                    {name}
                                </a>
                            ) : (
                                name
                            )}
                        </h5>

                        <div>
                            {rarity > 0 && <RarityTag number={rarity} />}

                            {family && family != "" && <Tag text={family} />}

                            {bait && (
                                <Tag
                                    text={bait}
                                    iconNode={
                                        baitIconMap[bait] ? (
                                            textIcon(baitIconMap[bait], "1em")
                                        ) : (
                                            <i className="bi bi-x-circle text-danger" />
                                        )
                                    }
                                    bgColor={"#000"}
                                />
                            )}
                        </div>

                        {time && <em>{time}</em>}

                        {dataObject.description && (
                            <div className="text-s text-secondary d-none d-xxl-inline">
                                {dataObject.description}
                            </div>
                        )}

                        {!hasEntityLinks && showInventoryControls && (
                            <div className="mt-auto">{renderInventory()}</div>
                        )}
                    </div>
                    <div className={hasEntityLinks ? "col-3" : "col-4 col-md-5"}>
                        <img src={imgUrl} style={{ maxWidth: "100%" }} />
                    </div>
                </div>

                {!hasEntityLinks && showFavoriteControls && (
                    <div className="mt-auto">{renderFavorite()}</div>
                )}
                {hasEntityLinks && showInventoryControls && (
                    <div className="row mt-auto">
                        <div className="col-12 col-md-6 ">{renderEntityLinks()}</div>
                        <div className="col-12 col-md-6 ">{renderInventory()}</div>
                    </div>
                )}
                {hasEntityLinks && showFavoriteControls && (
                    <div className="row mt-auto">
                        <div className="col-12 col-md-9 ">{renderEntityLinks()}</div>
                        <div className="col-12 col-md-3  mt-auto">{renderFavorite()}</div>
                    </div>
                )}
                {hasEntityLinks && !showInventoryControls && !showFavoriteControls && (
                    <div className="row mt-auto">
                        <div className="col d-flex flex-wrap">{renderEntityLinks()}</div>
                    </div>
                )}
            </div>
        </div>
    );
};
export default CustomCard;
