export const textIcon = (src: string, size?: number) => {
  const defaultSize = 20;
  const iconSize = size ? size : defaultSize;
  return (
    <img
      src={src}
      style={{
        height: iconSize,
        position: "relative",
        top: "-2px",
      }}
    />
  );
};

export const icoCoin = textIcon("https://palia.wiki.gg/images/Gold.png");
export const icoStar = textIcon(
  "https://palia.wiki.gg/images/thumb/SQ.png/23px-SQ.png?"
);
export const icoFocus = textIcon("https://palia.wiki.gg/images/Focus.png");

export const icoWorm = textIcon("https://palia.wiki.gg/images/Worm.png");
export const icoGlowWorm = textIcon(
  "https://palia.wiki.gg/images/Glow_Worm.png"
);

/*(
  <img
    src="https://palia.wiki.gg/images/Gold.png?88ce6f"
    style={{ height: "20px", position: "relative", top: "-2px" }}
  />
);*/
