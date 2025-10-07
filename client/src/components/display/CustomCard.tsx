import Tag from "./Tag";
import RarityTag from "./RarityTag";
import missingImg from "../../assets/images/missing.png";
import type { Multilist_entry } from "../../app/types/types";

const CustomCard = (props: {
  id: string;
  title: string;
  rarity?: string;
  description: string;
  imgsrc: string;
  url: string;
  multiListTitle?: string;
  multiListArr?: Multilist_entry[];
}) => {
  const strKey = props.id;

  let imgurl = missingImg;
  if (props.imgsrc && props.imgsrc != "") {
    imgurl = `https://palia.wiki.gg${props.imgsrc}`;
  }

  const multiTagBlock = () => {
    return (
      <div className="col">
        <b className="text-s">{props.multiListTitle}:</b>
        <div className="d-flex flex-wrap">
          {Array.isArray(props.multiListArr) &&
            props.multiListArr.length > 0 &&
            props.multiListArr.map((item) => (
              <Tag
                key={`${strKey}-${item.url}`}
                text={item.title}
                title={item.category}
              />
            ))}
        </div>
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
          ></input>
          <button
            type="button"
            className="btn btn-outline-secondary rounded fw-bold"
            style={{
              minWidth: 40,
              width: 40,
              height: 40,
            }}
          >
            +
          </button>
        </div>
      </>
    );
  };

  return (
    <div key={strKey} className="col-12 col-sm-6 col-lg-4 col-xl-3 d-flex">
      <div
        className="container border border-1 rounded-3"
        style={{
          background:
            "linear-gradient(180deg,rgba(226, 229, 233, 1) 0%, rgba(226, 229, 233, 0.9) 40%, rgba(46, 127, 233, 0.5) 100%",
        }}
      >
        <div className="row py-1">
          <div className="col d-flex row flex-column">
            <h5 className="card-title">{props.title}</h5>
            <div>{props.rarity && <RarityTag id={props.rarity} />}</div>
            <div className="">{props.description}</div>
            {!props.multiListTitle && (
              <div className="">{inventoryBlock()}</div>
            )}
          </div>
          <div className={props.multiListTitle ? "col-3" : "col-4 col-md-5"}>
            <img src={imgurl} style={{ maxWidth: "100%" }} />
          </div>
        </div>

        {props.multiListTitle && (
          <div className="row">
            {multiTagBlock()}
            <div className="col-12 col-md-6 ">{inventoryBlock()}</div>
          </div>
        )}
      </div>
    </div>
  );
};
export default CustomCard;
/*
        <div className="row">
          <div className="col">
            <h5 className="card-title">{props.title}</h5>
            <div className="">
              {props.rarity && <RarityTag id={props.rarity} />}
            </div>
            <div className="card-body text-wrap text-break ">
              {props.description}
            </div>
          </div>

          <div className="col-3">
            {props.imgsrc && (
              <img
                src={`https://palia.wiki.gg${props.imgsrc}`}
                className="p-1"
                style={{ width: 100 }}
              />
            )}
          </div>
        </div>

        <div className="row">
          <div className="col"></div>
          <div className="col">buttons</div>
        </div>

*/
