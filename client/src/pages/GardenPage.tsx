import { useEffect, useState } from "react";
import { selectAllCrops } from "../features/slices/GardenSlice";
import type { CROP_Entry } from "../app/types/gardenTypes";
import { useSubmenu } from "../context/SubmenuContext";

import ProfitTable from "../features/garden/ProfitTable";
import CropCard from "../features/garden/CropCard";
import ProfitCard from "../features/garden/ProfitCard";
import GardenLayout from "../features/garden/GardenLayout";

const GardenPage = () => {
  const cropArr = selectAllCrops();
  const [activeCrop, setActiveCrop] = useState<CROP_Entry | null>(null);
  const { setItems, clearItems } = useSubmenu();

  useEffect(() => {
    setItems([
      { label: "Quick Overview", href: "#ProfitCard" },
      { label: "Profit Table", href: "#ProfitTable" },
      { label: "Garden Layout", href: "#GardenLayout" },
    ]);
    return () => clearItems();
  }, [setItems, clearItems]);

  if (cropArr) {
    return (
      <div className="container-fluid overflow-auto">
        <ProfitCard />
        {activeCrop && (
          <CropCard crop={activeCrop} setActiveCrop={setActiveCrop} />
        )}
        <ProfitTable cropArr={cropArr} setActiveCrop={setActiveCrop} />

        <GardenLayout cropArr={cropArr} />
      </div>
    );
  }

  return <>nothing...</>;
};

export default GardenPage;
