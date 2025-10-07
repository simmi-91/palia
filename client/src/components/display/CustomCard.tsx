import Tag from "./Tag";
import RarityTag from "./RarityTag";
import missingImg from "../../assets/images/missing.png";

import { useAuth } from "../../context/AuthContext";

import type {
  Multilist_entry,
  ARTIFACT_Entry,
  PLUSHIES_Entry,
} from "../../app/types/types";

type CustomCardProps = {
  dataObject: ARTIFACT_Entry | PLUSHIES_Entry;
  category: string; // Passed from parent (e.g., 'artifacts', 'plushies')
};

const CustomCard: React.FC<CustomCardProps> = ({ dataObject, category }) => {
  const id = dataObject.id;
  const name = dataObject.name;
  const url = dataObject.url;

  const { profile, inventory, updateInventoryAmount } = useAuth();

  const currentItem = inventory?.find(
    (item) => item.itemId === dataObject.id && item.category === category
  );
  const currentAmount = currentItem ? currentItem.amount : 0;
  if (profile) {
    console.log(inventory);
  }

  const maxAmount = 999;
  const handleIncrement = () => {
    // You might want to enforce a max amount here (e.g., max: 999)
    updateInventoryAmount(category, id, currentAmount + 1);
  };

  const handleDecrement = () => {
    if (currentAmount > 0) {
      updateInventoryAmount(category, id, currentAmount - 1);
    }
  };

  const showInventoryControls = !!profile;

  let imgurl = missingImg;
  if ("image" in dataObject && dataObject.image && dataObject.image != "") {
    imgurl = `https://palia.wiki.gg${dataObject.image}`;
  }

  const rarity = "rarity" in dataObject ? dataObject.rarity : "";

  let hasMultiList = false;
  if ("howToObtain" in dataObject) {
    hasMultiList = true;
  }

  const multiTagBlock = () => {
    return <></>;
    /*return (
      <div className="col">
        
        <b className="text-s">{dataObject.multiListTitle}:</b>
        <div className="d-flex flex-wrap">
          {Array.isArray(dataObject.multiListArr) &&
            dataObject.multiListArr.length > 0 &&
            dataObject.multiListArr.map((item) => (
              <Tag
                key={`${id}-${item.url}`}
                text={item.title}
                title={item.category}
              />
            ))}
        </div>
      </div>
    );*/
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
            <h5 className="card-title">{name}</h5>
            <div>{rarity && <RarityTag id={rarity} />}</div>

            {showInventoryControls && (
              <div className="">{inventoryBlock()}</div>
            )}
          </div>
          <div className={hasMultiList ? "col-3" : "col-4 col-md-5"}>
            <img src={imgurl} style={{ maxWidth: "100%" }} />
          </div>
        </div>

        {/*hasMultiList && (
          <div className="row">
            {
              //multiTagBlock()
            }
            <div className="col-12 col-md-6 ">{inventoryBlock()}</div>
          </div>
        )*/}
      </div>
    </div>
  );
};
export default CustomCard;
