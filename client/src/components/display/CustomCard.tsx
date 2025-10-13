import Tag from "./Tag";
import RarityTag from "./RarityTag";
import missingImg from "../../assets/images/missing.png";
import { icoWorm, icoGlowWorm } from "../../app/icons/common";

import { useAuth } from "../../context/AuthContext";

import type {
  Multilist_entry,
  PlushiesEntry,
  CatchableEntry,
  FishEntry,
  StickerEntry,
  MainItemEntry,
} from "../../app/types/wikiTypes";

type CustomCardProps = {
  dataObject: MainItemEntry;
  category: string; // Passed from parent (e.g., 'artifacts', 'plushies')
  isTradeable: boolean;
};

const getMultiListProps = (
  data: MainItemEntry
): { title: string; list: Multilist_entry[] }[] => {
  const multiListProperties: { title: string; list: Multilist_entry[] }[] = [];
  for (const key in data) {
    if (key === "bait") {
      //skip
    } else if (Object.prototype.hasOwnProperty.call(data, key)) {
      const value = data[key as keyof typeof data];
      if (Array.isArray(value)) {
        if (value.length > 0) {
          const isMultiList =
            typeof value[0] === "object" &&
            value[0] !== null &&
            "title" in value[0];

          if (isMultiList) {
            const title = key
              .replace(/([A-Z])/g, " $1")
              .replace(/^./, (str) => str.toUpperCase());

            multiListProperties.push({
              title: title,
              list: value as Multilist_entry[],
            });
          }
        }
      }
    }
  }
  return multiListProperties;
};

const CustomCard: React.FC<CustomCardProps> = ({
  dataObject,
  category,
  isTradeable,
}) => {
  const id = dataObject.id;
  const name = dataObject.name;

  const { profile, inventory, updateInventoryAmount } = useAuth();

  const currentItem = inventory?.find(
    (item) => item.itemId === dataObject.id && item.category === category
  );
  const currentAmount = currentItem ? currentItem.amount : 0;

  const showInventoryControls = isTradeable && profile;
  const showFavoriteControls = !isTradeable && profile;

  let imgurl = missingImg;
  if ("image" in dataObject && dataObject.image && dataObject.image != "") {
    imgurl = dataObject.image;
  }

  const rarity =
    "rarity" in dataObject
      ? (dataObject as CatchableEntry | PlushiesEntry | StickerEntry).rarity
      : 0;

  const bait = "bait" in dataObject ? (dataObject as FishEntry).bait : "";

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
    const item = {
      category: category,
      itemId: id,
      favorite: 0,
    };
    console.log("handleFavorite", item);
  };

  const multiTagBlock = () => {
    return (
      <div className="col d-flex">
        {multilist.map((cat) => (
          <div className="row">
            <b className="text-s">{cat.title}:</b>
            <div className="d-flex flex-wrap">
              {cat.list.map((listItem, idx) => {
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
        <div className="input-group mb-1 flex-nowrap">
          <button
            type="button"
            className="btn btn-outline-secondary rounded fw-bold"
            style={{
              minWidth: 40,
              width: 40,
              height: 40,
            }}
            onClick={handleFavorite}
          >
            <i className="bi bi-star"></i>
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
            {bait && (
              <div>
                {Array.isArray(bait)
                  ? bait.map((item) => {
                      if (item.title === "Worm") {
                        return (
                          <span
                            title={item.title}
                            className=" rounded-circle opacity-75 px-1 py-1 text-s bg-dark"
                          >
                            {icoWorm}
                          </span>
                        );
                      } else if (item.title === "Glow Worm") {
                        return (
                          <span
                            title={item.title}
                            className=" rounded-circle opacity-75 px-1 py-1 text-s bg-dark"
                          >
                            {icoGlowWorm}
                          </span>
                        );
                      }
                    })
                  : bait}
              </div>
            )}

            {!hasMultiList && showInventoryControls && (
              <div className="">{inventoryBlock()}</div>
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
        {hasMultiList && !showInventoryControls && (
          <div className="row">
            <div className="col d-flex flex-wrap">{multiTagBlock()}</div>
          </div>
        )}

        {showFavoriteControls && (
          <div className=" visually-hidden">{favoriteBlock()}</div>
        )}
      </div>
    </div>
  );
};
export default CustomCard;
