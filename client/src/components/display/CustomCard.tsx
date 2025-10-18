import { useAuth } from "../../context/AuthContext";
import { useState } from "react";

import Tag from "./Tag";
import RarityTag from "./RarityTag";
import missingImg from "../../assets/images/missing.png";
import { getMultiListProps } from "../../utils/multilistProperties";

import {
  useAddFavorite,
  useRemoveFavorite,
} from "../../hooks/useFavoriteMutations";

import type {
  PlushiesEntry,
  CatchableEntry,
  FishEntry,
  StickerEntry,
  MainItemEntry,
  MultilistEntry,
  MultilistProps,
  PotatoPodEntry,
} from "../../app/types/wikiTypes";

type CustomCardProps = {
  dataObject: MainItemEntry;
  category: string; // Passed from parent (e.g., 'artifacts', 'plushies')
  isTradeable: boolean;
  favoriteId: number;
};

const CustomCard: React.FC<CustomCardProps> = ({
  dataObject,
  category,
  isTradeable,
  favoriteId,
}) => {
  const id = dataObject.id;
  const name = dataObject.name;
  const [favoriteState, setFavoriteState] = useState(
    favoriteId > 0 ? true : false
  );

  const { profile, inventory, updateInventoryAmount } = useAuth();
  const profileId = profile ? profile.id : "";
  const { add: addFavoriteMutate, isPending: addingFav } =
    useAddFavorite(profileId);
  const { remove: removeFavoriteMutate, isPending: removingFav } =
    useRemoveFavorite(profileId);

  const currentItem = inventory?.find(
    (item) => item.itemId === dataObject.id && item.category === category
  );
  const currentAmount = currentItem ? currentItem.amount : 0;

  const showInventoryControls = isTradeable && profileId != "";
  const showFavoriteControls = !isTradeable && profileId != "";

  let imgurl = missingImg;
  if ("image" in dataObject && dataObject.image && dataObject.image != "") {
    imgurl = dataObject.image;
  }

  const rarity =
    "rarity" in dataObject
      ? (dataObject as CatchableEntry | PlushiesEntry | StickerEntry).rarity
      : 0;
  const bait = "bait" in dataObject ? (dataObject as FishEntry).bait : "";
  const family =
    "family" in dataObject ? (dataObject as PotatoPodEntry).family : "";

  const multilist = getMultiListProps(dataObject);
  let hasMultiList = false;
  if (multilist && multilist.length > 0) {
    hasMultiList = true;
  }

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
    const item = {
      category: category,
      itemId: id,
      amount: currentAmount + 1,
    };
    if (currentAmount < maxAmount) {
      updateInventoryAmount(item);
    }
  };

  const handleDecrement = () => {
    const item = {
      category: category,
      itemId: id,
      amount: currentAmount - 1,
    };
    if (currentAmount > 0) {
      updateInventoryAmount(item);
    }
  };

  const handleFavorite = () => {
    if (!profileId) return;
    try {
      if (favoriteState) {
        removeFavoriteMutate(
          { favoriteId },
          {
            onSuccess: () => setFavoriteState(false),
          }
        );
      } else {
        addFavoriteMutate(
          { category, itemId: id },
          {
            onSuccess: () => setFavoriteState(true),
          }
        );
      }
    } catch (e) {
      console.error("Failed to edit favorite state", e);
    }
  };

  const multiTagBlock = () => {
    return (
      <div className="col d-flex">
        {multilist.map((cat: MultilistProps) => (
          <div key={cat.title.replace(/\s/g, "").toLowerCase()} className="row">
            <b className="text-s">{cat.title}:</b>
            <div className="d-flex flex-wrap">
              {cat.list.map((listItem: MultilistEntry, idx: number) => {
                let icon = "";
                if (listItem.category === "Bug Catching") {
                  icon = "bi-bug-fill";
                } else if (listItem.category === "Fishing") {
                  icon = "bi-droplet-fill";
                } else if (listItem.category === "Hunting") {
                  icon = "bi-heart-arrow";
                } else if (listItem.category === "Rummage Pile") {
                  icon = "bi-virus";
                }

                return (
                  <Tag
                    key={`${id}-${listItem.url}-${idx}`}
                    text={listItem.title}
                    title={listItem.category}
                    icon={icon}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const inventoryBlock = () => {
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
            disabled={currentAmount <= 0}
          >
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
            readOnly
          ></input>
          <button
            type="button"
            className="btn btn-outline-secondary rounded fw-bold"
            style={{
              minWidth: 40,
              width: 40,
              height: 40,
            }}
            onClick={handleIncrement}
            disabled={currentAmount >= maxAmount}
          >
            +
          </button>
        </div>
      </>
    );
  };

  const favoriteBlock = () => {
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
            disabled={addingFav || removingFav}
          >
            {favoriteState ? (
              <i
                className="bi bi-star-fill fs-5"
                style={{
                  WebkitTextStrokeWidth: "2px",
                  WebkitTextStrokeColor: "black",
                  color: "yellow",
                }}
              ></i>
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
        className="container border border-1 rounded-3"
        style={{
          background:
            "linear-gradient(180deg,rgba(226, 229, 233, 1) 0%, rgba(226, 229, 233, 0.9) 40%, rgba(46, 127, 233, 0.5) 100%",
        }}
      >
        <div className="row py-1">
          <div className="col d-flex row flex-column">
            <h5 className="card-title">
              {baseUrl ? (
                <a
                  href={dataObject.url}
                  target={category}
                  title={`Go to wiki page, ${baseUrl}`}
                  className="text-black text-decoration-none link-primary"
                >
                  {name}
                </a>
              ) : (
                name
              )}
            </h5>

            {rarity > 0 && (
              <div>
                <RarityTag number={rarity} />
              </div>
            )}

            {family != "" && (
              <div>
                <Tag text={family} />
              </div>
            )}

            {bait && <div>{bait}</div>}

            {!hasMultiList && showInventoryControls && (
              <div className="">{inventoryBlock()}</div>
            )}
            {!hasMultiList && showFavoriteControls && (
              <div className="">{favoriteBlock()}</div>
            )}
          </div>
          <div className={hasMultiList ? "col-3" : "col-4 col-md-5"}>
            <img src={imgurl} style={{ maxWidth: "100%" }} />
          </div>
        </div>

        {hasMultiList && showInventoryControls && (
          <div className="row">
            <div className="col-12 col-md-6 ">{multiTagBlock()}</div>
            <div className="col-12 col-md-6 ">{inventoryBlock()}</div>
          </div>
        )}
        {hasMultiList && showFavoriteControls && (
          <div className="row">
            <div className="col-12 col-md-9 ">{multiTagBlock()}</div>
            <div className="col-12 col-md-3 ">{favoriteBlock()}</div>
          </div>
        )}
        {hasMultiList && !showInventoryControls && !showFavoriteControls && (
          <div className="row">
            <div className="col d-flex flex-wrap">{multiTagBlock()}</div>
          </div>
        )}
      </div>
    </div>
  );
};
export default CustomCard;
