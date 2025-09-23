import type { JSX } from "react";
import {
  priceFertilizer,
  priceGlowWorm,
  priceWorm,
} from "../../app/shared/PRICES";
import type {
  CROP_Entry,
  Seed,
  Preserve,
  Worm,
} from "../../app/types/GardenTypes";
import { textIcon, icoCoin, icoStar } from "../../app/icons/common";
import { calcWormProfit, calcProductProfit } from "../../utils/calculations";

const CropCard = ({
  crop,
  setActiveCrop,
}: {
  crop: CROP_Entry;
  setActiveCrop: (crop: CROP_Entry | null) => void;
}) => {
  const cropIcon = textIcon(crop.icon);

  return (
    <div className="card m-2">
      <h5 className="card-header d-flex ">
        <span className="px-2">{icoStar}</span>
        <span className="flex-fill">{crop.name}</span>
        <button
          onClick={() => setActiveCrop(null)}
          type="button"
          className="btn-close"
          aria-label="Close"
        ></button>
      </h5>

      <div className="container">
        <div className="d-flex flex-wrap">
          <div className="text-nowrap p-2">Base Price: {crop.basePrice}</div>
          <div className="text-nowrap p-2">StarPrice: {crop.starPrice}</div>
          <div className="text-nowrap p-2">Harvest at {crop.harvest}</div>
          <div className="text-nowrap p-2">Uses {crop.plotSize} plots</div>
          <div className="text-nowrap p-2">
            Amount per harvest {crop.harvestAmount}
          </div>
          <div className=" p-2">
            Nearby effect {crop.effect} (unless same crop)
          </div>
        </div>

        <div className="d-flex flex-wrap">
          {listProductInfo(cropIcon, "Seed", crop.seed)}
          {listProductInfo(cropIcon, "Preserve", crop.preserve)}

          {crop.worm.wormOutput > 0 &&
            listProductInfo(cropIcon, "Worm", crop.worm)}
          {crop.glowworm.wormOutput > 0 &&
            listProductInfo(cropIcon, "GlowWorm", crop.glowworm)}
          {crop.worm.wormOutput > 0 &&
            listProductInfo(cropIcon, "Prices", null)}
        </div>

        <hr />

        <div className="d-flex flex-wrap">
          {calcProductProfit(crop.starPrice, crop.seed, "seed", "desc")}
          {calcProductProfit(crop.starPrice, crop.preserve, "preserve", "desc")}

          {crop.worm.wormOutput > 0 &&
            calcWormProfit(crop.starPrice, crop.worm, "worm", "desc")}
          {crop.glowworm.wormOutput > 0 &&
            calcWormProfit(crop.starPrice, crop.worm, "glowworm", "desc")}
        </div>
      </div>
    </div>
  );
};

const listProductInfo = (
  cropIcon: JSX.Element,
  title: string,
  product: Seed | Preserve | Worm | null
) => {
  let content: JSX.Element | null = null;

  if (!product) {
    content = (
      <>
        <li>
          Worm: {priceWorm}
          {icoCoin}
        </li>
        <li>
          GlowWorm: {priceGlowWorm}
          {icoCoin}
        </li>
        <li>
          Fertilizer: {priceFertilizer}
          {icoCoin}
        </li>
      </>
    );
  } else if ("wormOutput" in product) {
    content = (
      <>
        <li>1{cropIcon} gives</li>
        <li>{product.wormOutput} worms and</li>
        <li>{product.fertilizerOutput} fertilizers</li>
      </>
    );
  } else if (product.price === 0) {
    return <></>;
  } else if ("input" in product && title === "Seed") {
    content = (
      <>
        <li>
          {product.input}
          {cropIcon} gives
        </li>
        <li>
          {product.output} seeds in {product.time}
        </li>
        <li>
          at {product.price}
          {icoCoin} per seed
        </li>
      </>
    );
  } else if ("price" in product && title === "Preserve") {
    content = (
      <>
        <li>1{cropIcon} gives</li>
        <li>1 preserve in {product.time}</li>
        <li>
          at {product.price}
          {icoCoin} per seed
        </li>
      </>
    );
  }

  return (
    <ul className="list-unstyled text-nowrap mx-3 fs-6">
      <li>
        <b>{title}</b>
      </li>
      {content}
    </ul>
  );
};

export default CropCard;
