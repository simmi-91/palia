import type { Preserve, Seed, Worm } from "../app/types/gardenTypes";
import type React from "react";
import { icoCoin } from "../app/icons/common";

import {
  priceFertilizer,
  priceWorm,
  priceGlowWorm,
} from "../app/shared/PRICES";

export function roundedInt(num: number) {
  const rounded = Math.round(num);
  return rounded;
}
export function roundedFloat(num: number) {
  const rounded = Math.round(num * 10) / 10;
  return rounded;
}

export function calcProductProfit(
  cropPrice: number,
  productObject: Seed | Preserve,
  productType: string,
  returnType: "calc"
): number;
export function calcProductProfit(
  cropPrice: number,
  productObject: Seed | Preserve,
  productType: string,
  returnType: "desc"
): React.ReactElement;
export function calcProductProfit(
  cropPrice: number,
  productObject: Seed | Preserve,
  productType: string,
  returnType: string
) {
  if (productObject.price === 0) return returnType === "calc" ? 0 : <></>;

  const input = "input" in productObject ? productObject.input : 1;
  const output = "output" in productObject ? productObject.output : 1;
  const costPerProduct = (input * cropPrice) / output;
  const profitPerProduct = productObject.price - costPerProduct;
  const profitPercentage = (profitPerProduct / costPerProduct) * 100;

  if (returnType === "calc") {
    return profitPercentage;
  } else if (returnType === "desc") {
    return (
      <ul className="list-unstyled mx-3 fs-6">
        <li>
          <b>{productType}</b> profit per product: {profitPerProduct}
          {icoCoin} ~ {roundedFloat(profitPercentage)}%
        </li>
        <li>costPerProduct = (input * cropPrice) / output </li>
      </ul>
    );
  }
}

export function calcWormProfit(
  cropPrice: number,
  wormObject: Worm,
  productType: string,
  returnType: "calc"
): number;
export function calcWormProfit(
  cropPrice: number,
  wormObject: Worm,
  productType: string,
  returnType: "desc"
): React.ReactElement;
export function calcWormProfit(
  cropPrice: number,
  wormObject: Worm,
  productType: string,
  returnType: string
) {
  if (wormObject.wormOutput === 0) return returnType === "calc" ? 0 : <></>;

  let wormPrice = priceWorm;
  if (productType === "glowworm") {
    wormPrice = priceGlowWorm;
  }
  const wormValue = wormObject.wormOutput * wormPrice;
  const fertValue = wormObject.fertilizerOutput * priceFertilizer;
  const outputValue = wormValue + fertValue;
  const outputProfit = outputValue - cropPrice;
  const profitPercentage = (outputProfit / cropPrice) * 100;

  if (returnType === "calc") {
    return profitPercentage;
  } else if (returnType === "desc") {
    return (
      <ul className="list-unstyled mx-3 fs-6">
        <li>
          <b>{productType}</b> profit per crop: {outputProfit}
          {icoCoin} ~ {roundedFloat(profitPercentage)}%
        </li>
        <li>outputValue = (worms*wormPrice) + (fertilizer*fertPrice) </li>
        <li>outputProfit = outputValue - cropPrice </li>
      </ul>
    );
  }
}

export const parseHarvestString = (harvest: string | number): number => {
  if (typeof harvest === "number") {
    return harvest;
  }
  const numbers = harvest.match(/\d+/g);
  if (numbers) {
    return numbers.reduce((sum, num) => sum + parseInt(num), 0);
  }
  return 0;
};
