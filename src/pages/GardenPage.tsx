import { useState } from "react";
import { selectAllCrops } from "../features/slices/GardenSlice";
import type { CROP_Entry } from "../app/types/GardenTypes";

import ProfitTable from "../features/garden/ProfitTable";
import CropCard from "../features/garden/CropCard";
import ProfitCard from "../features/garden/ProfitCard";

import { textIcon } from "../app/icons/common";

const GardenPage = () => {
  const cropArr = selectAllCrops();
  const [activeCrop, setActiveCrop] = useState<CROP_Entry | null>(null);

  if (cropArr) {
    return (
      <div className="container overflow-auto">
        <ProfitCard />
        {activeCrop && (
          <CropCard crop={activeCrop} setActiveCrop={setActiveCrop} />
        )}
        <ProfitTable cropArr={cropArr} setActiveCrop={setActiveCrop} />
        <div className="card m-2 ">
          <div className="card-header">Self sustainable layout</div>
          <div className="row p-2">
            <div className="col">
              <img
                src="/src/assets/images/hage.png"
                className=""
                style={{ maxWidth: "100%" }}
              />
            </div>
            <div className="col">
              <a
                className="fw-bold"
                href="https://palia-garden-planner.vercel.app/?layout=v0.4_D-111-111-111_CR-AAAAAAAAA-PTCBkPTCBkP-BkPT.WCBkPTCBk-CBkPTCBkPTC-TCBkPTCBkPT-PTCBkPTCBkP-CPTBkCPT.YBkC-CBkPTCBkPTC-TCBkPBBBkBB_D30L37Cr0.C.P-CP-BkS3-TP3-PS2"
              >
                Initial seed planting:
              </a>
              <div className="col">
                <div title="Tomato">
                  16
                  {textIcon(
                    "https://palia.wiki.gg/images/thumb/Tomato_Plant_Seed.png/50px-Tomato_Plant_Seed.png"
                  )}
                </div>
                <div title="Potato">
                  17
                  {textIcon(
                    "https://palia.wiki.gg/images/thumb/Potato_Seed.png/50px-Potato_Seed.png"
                  )}
                </div>
                <div title="Carrot">
                  18
                  {textIcon(
                    "https://palia.wiki.gg/images/thumb/Carrot_Seed.png/50px-Carrot_Seed.png"
                  )}
                </div>
                <div title="Bok hoy">
                  17
                  {textIcon(
                    "https://palia.wiki.gg/images/thumb/Bok_Choy_Seed.png/50px-Bok_Choy_Seed.png"
                  )}
                </div>
                <div title="Apple">
                  1
                  {textIcon(
                    "https://palia.wiki.gg/images/thumb/Apple_Tree_Seed.png/50px-Apple_Tree_Seed.png"
                  )}
                </div>
                <div title="Blueberry / Batterfly Bean / Spicy Pepper / Rockhopper Pumpkin ">
                  1
                  {textIcon(
                    "https://palia.wiki.gg/images/thumb/Blueberry_Bush_Seed.png/50px-Blueberry_Bush_Seed.png"
                  )}
                  /
                  {textIcon(
                    "https://palia.wiki.gg/images/thumb/Batterfly_Bean_Seeds.png/50px-Batterfly_Bean_Seeds.png"
                  )}
                  /
                  {textIcon(
                    "https://palia.wiki.gg/images/thumb/Spicy_Pepper_Seed.png/50px-Spicy_Pepper_Seed.png"
                  )}
                  /
                  {textIcon(
                    "https://palia.wiki.gg/images/thumb/Rockhopper_Pumpkin_Seed.png/50px-Rockhopper_Pumpkin_Seed.png"
                  )}
                </div>
              </div>
              <div className="col">
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
      </div>
    );
  }

  return <>nothing...</>;
};

export default GardenPage;
