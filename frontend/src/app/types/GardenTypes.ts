export type Seed = {
  price: number;
  input: number;
  output: number;
  time: string;
};

export type Preserve = {
  price: number;
  time: string;
};

export type Worm = {
  wormOutput: number;
  fertilizerOutput: number;
  time: string;
};

export type CROP_Entry = {
  name: string;
  icon: string;
  seedicon: string;
  harvest: string;
  effect: string;
  plotSize: number;
  basePrice: number;
  starPrice: number;
  harvestAmount: number;
  seed: Seed;
  preserve: Preserve;
  worm: Worm;
  glowworm: Worm;
};
