import type { CROP_Entry } from "../../app/types/gardenTypes";
import {
  calcProductProfit,
  calcWormProfit,
  roundedInt,
  parseHarvestString,
} from "../../utils/calculations";
import { textIcon } from "../../app/icons/common";
import { useState } from "react";

const ProfitTable = ({
  cropArr,
  setActiveCrop,
}: {
  cropArr: CROP_Entry[];
  setActiveCrop: (crop: CROP_Entry) => void;
}) => {
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const sortedCropArr = [...cropArr].sort((a, b) => {
    if (!sortColumn) return 0;
    let aValue: any;
    let bValue: any;

    switch (sortColumn) {
      case "Crop":
        aValue = a.name;
        bValue = b.name;
        break;
      case "Effect":
        aValue = a.effect;
        bValue = b.effect;
        break;
      case "Harvest":
        aValue = parseHarvestString(a.harvest);
        bValue = parseHarvestString(b.harvest);
        break;
      case "Seed":
        aValue = calcProductProfit(a.starPrice, a.seed, "Seed", "calc");
        bValue = calcProductProfit(b.starPrice, b.seed, "Seed", "calc");
        break;
      case "Preserve":
        aValue = calcProductProfit(a.starPrice, a.preserve, "Preserve", "calc");
        bValue = calcProductProfit(b.starPrice, b.preserve, "Preserve", "calc");
        break;
      case "Worm":
        aValue = calcWormProfit(a.starPrice, a.worm, "worm", "calc");
        bValue = calcWormProfit(b.starPrice, b.worm, "worm", "calc");
        break;
      case "G.Worm":
        aValue = calcWormProfit(a.starPrice, a.glowworm, "glowworm", "calc");
        bValue = calcWormProfit(b.starPrice, b.glowworm, "glowworm", "calc");
        break;
      default:
        return 0;
    }

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortDirection === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    } else if (typeof aValue === "number" && typeof bValue === "number") {
      return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
    } else {
      return 0;
    }
  });

  const markProfit = (num: number): string => {
    if (num === 0) return "text-light";
    else if (num > 50) return "table-success";
    else if (num > 25) return "table-warning";
    else if (num < 1) return "table-danger";
    else return "";
  };

  const tRow = (i: number, crop: CROP_Entry) => {
    const seedProfit = calcProductProfit(
      crop.starPrice,
      crop.seed,
      "Seed",
      "calc"
    );
    const roundedSeed = roundedInt(seedProfit);

    const preserveProfit = calcProductProfit(
      crop.starPrice,
      crop.preserve,
      "Preserve",
      "calc"
    );
    const roundedPreserve = roundedInt(preserveProfit);

    const wormProfit = calcWormProfit(
      crop.starPrice,
      crop.worm,
      "worm",
      "calc"
    );
    const roundedWorm = roundedInt(wormProfit);

    const glowwormProfit = calcWormProfit(
      crop.starPrice,
      crop.glowworm,
      "glowworm",
      "calc"
    );
    const roundedGWorm = roundedInt(glowwormProfit);

    const cropIcon = textIcon(crop.icon);

    return (
      <tr key={i.toString()}>
        <td role="button" onClick={() => setActiveCrop(crop)}>
          <a
            title="See detailed crop info"
            className="text-decoration-none link-opacity-50-hover link-dark"
          >
            {cropIcon}
            {crop.name}
          </a>
        </td>
        <td>{crop.effect}</td>
        <td>{crop.harvest}</td>
        <td className={markProfit(roundedSeed)}>{roundedSeed}%</td>
        <td className={markProfit(roundedPreserve)}>{roundedPreserve}%</td>
        <td className={markProfit(roundedWorm)}>{roundedWorm}%</td>
        <td className={markProfit(roundedGWorm)}>{roundedGWorm}%</td>
      </tr>
    );
  };

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  return (
    <div id="ProfitTable" className="container-fluid overflow-x-auto card ">
      <table className="table table-striped table-hover">
        <thead>
          <tr>
            <th scope="col" onClick={() => handleSort("Crop")}>
              <a
                title="Sort on Crop"
                className="text-decoration-none link-opacity-50-hover link-dark"
              >
                Crop{" "}
                {sortColumn === "Crop" && (sortDirection === "asc" ? "▲" : "▼")}
              </a>
            </th>
            <th scope="col" className="" onClick={() => handleSort("Effect")}>
              <a
                title="Sort on Effect"
                className="text-decoration-none link-opacity-50-hover link-dark"
              >
                Effect{" "}
                {sortColumn === "Effect" &&
                  (sortDirection === "asc" ? "▲" : "▼")}
              </a>
            </th>
            <th scope="col" className="" onClick={() => handleSort("Harvest")}>
              <a
                title="Sort on Harvest"
                className="text-decoration-none link-opacity-50-hover link-dark"
              >
                Harvest{" "}
                {sortColumn === "Harvest" &&
                  (sortDirection === "asc" ? "▲" : "▼")}
              </a>
            </th>
            <th scope="col" className="" onClick={() => handleSort("Seed")}>
              <a
                title="Sort on Seed"
                className="text-decoration-none link-opacity-50-hover link-dark"
              >
                Seed{" "}
                {sortColumn === "Seed" && (sortDirection === "asc" ? "▲" : "▼")}
              </a>
            </th>
            <th scope="col" className="" onClick={() => handleSort("Preserve")}>
              <a
                title="Sort on Preserve"
                className="text-decoration-none link-opacity-50-hover link-dark"
              >
                Preserve{" "}
                {sortColumn === "Preserve" &&
                  (sortDirection === "asc" ? "▲" : "▼")}
              </a>
            </th>
            <th scope="col" className="" onClick={() => handleSort("Worm")}>
              <a
                title="Sort on Worm"
                className="text-decoration-none link-opacity-50-hover link-dark"
              >
                Worm{" "}
                {sortColumn === "Worm" && (sortDirection === "asc" ? "▲" : "▼")}
              </a>
            </th>
            <th scope="col" className="" onClick={() => handleSort("G.Worm")}>
              <a
                title="Sort on G.Worm"
                className="text-decoration-none link-opacity-50-hover link-dark"
              >
                G.Worm{" "}
                {sortColumn === "G.Worm" &&
                  (sortDirection === "asc" ? "▲" : "▼")}
              </a>
            </th>
          </tr>
        </thead>
        <tbody>{sortedCropArr.map((crop, i) => tRow(i, crop))}</tbody>
      </table>
    </div>
  );
};

export default ProfitTable;
