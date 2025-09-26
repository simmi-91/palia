import { textIcon } from "../../app/icons/common";
import type { CROP_Entry } from "../../app/types/GardenTypes";

type CROP_Entry_WithSeeds = CROP_Entry & {
  numSeeds: number;
};

const GardenLayout = ({ cropArr }: { cropArr: CROP_Entry[] }) => {
  const seedCounts = {
    Tomato: 16,
    Potato: 17,
    Carrot: 18,
    "Bok Choi": 17,
    Apple: 1,
    Blueberry: 1,
  };

  const waterCrops = cropArr.filter((crop) => crop.effect === "Water Retain");
  const weedCrops = cropArr.filter((crop) => crop.effect === "Weed Block");

  const mainCrops = cropArr
    .filter((crop) => crop.name in seedCounts)
    .map((crop) => ({
      ...crop,
      numSeeds: seedCounts[crop.name as keyof typeof seedCounts],
    }))
    .sort((a, b) => {
      return b.numSeeds - a.numSeeds;
    });

  const seedElem = (crop: CROP_Entry | CROP_Entry_WithSeeds) => {
    const name = crop.name;
    const key = name.replace(/\s/, "_").toLowerCase();
    const icon = textIcon(crop.seedicon);

    return (
      <div key={key} title={name + " (" + crop.harvest + ")"} className="pe-2">
        {"numSeeds" in crop ? crop.numSeeds : null}
        {icon}
      </div>
    );
  };

  return (
    <div id="GardenLayout" className="card my-2 ">
      <div className="card-header">Self sustainable layout</div>
      <div className="row p-2">
        <div className="col">
          <img
            src="./images/hage.png"
            className=""
            style={{ maxWidth: "100%" }}
          />
        </div>

        <div className="col ">
          <div className="col d-flex flex-wrap">
            <a
              className="fw-bold w-100"
              target="_blank"
              href="https://palia-garden-planner.vercel.app/?layout=v0.4_D-111-111-111_CR-AAAAAAAAA-PTCBkPTCBkP-BkPT.WCBkPTCBk-CBkPTCBkPTC-TCBkPTCBkPT-PTCBkPTCBkP-CPTBkCPT.YBkC-CBkPTCBkPTC-TCBkPBBBkBB_D30L37Cr0.C.P-CP-BkS3-TP3-PS2"
            >
              Initial seed planting:
            </a>
            {mainCrops && mainCrops.map((crop) => seedElem(crop))}
          </div>

          <div className="coll d-flex flex-wrap">
            Use two types with WaterRetain and two with WeedBlock.
          </div>

          <div className="coll d-flex flex-wrap mt-2">
            <b>Alternatives for WaterRetain crops: </b>
            {waterCrops && waterCrops.map((crop) => seedElem(crop))}
          </div>

          <div className="coll d-flex flex-wrap">
            <b>Alternatives for WeedBlock crops: </b>
            {weedCrops && weedCrops.map((crop) => seedElem(crop))}
          </div>

          <div className="col mt-2">
            <b>Recomended fertilizers:</b>

            <div title="WeedBlock Fertilizer">
              1
              {textIcon(
                "https://palia.wiki.gg/images/WeedBlock_Fertilizer.png"
              )}
              on NE corner
            </div>
            <div title="HydratePro Fertilizer">
              1
              {textIcon(
                "https://palia.wiki.gg/images/HydratePro_Fertilizer.png"
              )}
              on SW corner
            </div>
            <div title="HydratePro Fertilizer">
              9
              {textIcon(
                "https://palia.wiki.gg/images/HydratePro_Fertilizer.png"
              )}
              on NW corner (Apples)
            </div>
            <div title="HydratePro Fertilizer">
              4
              {textIcon(
                "https://palia.wiki.gg/images/HydratePro_Fertilizer.png"
              )}
              on SE corner (x4 plot-crop)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GardenLayout;
