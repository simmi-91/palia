import type { CROP_Entry } from "../../app/types/GardenTypes";
import {
  calcProductProfit,
  calcWormProfit,
  roundedInt,
} from "../../utils/calculations";
import { textIcon } from "../../app/icons/common";

const ProfitTable = ({
  cropArr,
  setActiveCrop,
}: {
  cropArr: CROP_Entry[];
  setActiveCrop: (crop: CROP_Entry) => void;
}) => {
  const markProfit = (num: number): string => {
    if (num === 0) return "text-light";
    else if (num > 50) return "table-success";
    else if (num > 25) return "table-warning";
    else if (num < 1) return "table-danger";
    else return "";
  };

  const tRow = (i: number, crop: CROP_Entry) => {
    //console.log(crop.name, crop.starPrice, crop);

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
          {cropIcon}
          {crop.name}
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

  return (
    <div className="container overflow-x-auto">
      <table className="table table-striped table-hover">
        <thead>
          <tr>
            <th scope="col">Crop</th>
            <th scope="col">Effect</th>
            <th scope="col">Harvest</th>
            <th scope="col">Seed</th>
            <th scope="col">Preserve</th>
            <th scope="col">Worm</th>
            <th scope="col">G.Worm</th>
          </tr>
        </thead>
        <tbody>{cropArr.map((crop, i) => tRow(i, crop))}</tbody>
      </table>
    </div>
  );
};

export default ProfitTable;
