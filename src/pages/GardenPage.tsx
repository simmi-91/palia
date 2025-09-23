import { useState } from "react";
import { selectAllCrops } from "../features/slices/GardenSlice";
import type { CROP_Entry } from "../app/types/GardenTypes";

import ProfitTable from "../features/garden/ProfitTable";
import CropCard from "../features/garden/CropCard";
import ProfitCard from "../features/garden/ProfitCard";

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
      </div>
    );
  }

  return <>nothing...</>;
};

export default GardenPage;
