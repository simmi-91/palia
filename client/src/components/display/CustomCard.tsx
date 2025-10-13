import Tag from "./Tag";
import RarityTag from "./RarityTag";
import missingImg from "../../assets/images/missing.png";

import { useAuth } from "../../context/AuthContext";

import type {
  Multilist_entry,
  ArtifactEntry,
  PlushiesEntry,
} from "../../app/types/wikiTypes";

type CustomCardProps = {
  dataObject: ArtifactEntry | PlushiesEntry;
  category: string; // Passed from parent (e.g., 'artifacts', 'plushies')
};

const getMultiListProps = (
  data: ArtifactEntry | PlushiesEntry
): { title: string; list: Multilist_entry[] }[] => {
  const multiListProperties: { title: string; list: Multilist_entry[] }[] = [];
  for (const key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
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

const CustomCard: React.FC<CustomCardProps> = ({ dataObject, category }) => {
  const id = dataObject.id;
  const name = dataObject.name;

  const { profile, inventory, updateInventoryAmount } = useAuth();

  const currentItem = inventory?.find(
    (item) => item.itemId === dataObject.id && item.category === category
  );
  const currentAmount = currentItem ? currentItem.amount : 0;

  const maxAmount = 999;
  const handleIncrement = () => {
    const item = {
      category: category,
      itemId: id,
      amount: currentAmount + 1,
    };
    if (currentAmount < 99) {
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

  const showInventoryControls = !!profile;

  let imgurl = missingImg;
  if ("image" in dataObject && dataObject.image && dataObject.image != "") {
    imgurl = dataObject.image;
  }

  const rarity = "rarity" in dataObject ? dataObject.rarity : "";

  const multilist = getMultiListProps(dataObject);
  let hasMultiList = false;
  if (multilist && multilist.length > 0) {
    hasMultiList = true;
  }

  const multiTagBlock = () => {
    return (
      <div className="col">
        {multilist.map((cat) => (
          <div className="row">
            <b className="text-s">{cat.title}:</b>
            <div className="d-flex flex-wrap">
              {cat.list.map((listItem) => {
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
                    key={`${id}-${listItem.url}`}
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
            <div>{rarity && <RarityTag id={rarity} />}</div>

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
            <div className="col">{multiTagBlock()}</div>
          </div>
        )}
      </div>
    </div>
  );
};
export default CustomCard;
