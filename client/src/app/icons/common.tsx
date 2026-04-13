export const textIcon = (src: string, size?: number | string) => {
    const iconSize = size ?? 20;
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
export const icoStar = textIcon("https://palia.wiki.gg/images/thumb/SQ.png/23px-SQ.png?");
export const icoFocus = textIcon("https://palia.wiki.gg/images/Focus.png");

export const urlWorm = "https://palia.wiki.gg/images/Worm.png";
export const urlGlowWorm = "https://palia.wiki.gg/images/Glow_Worm.png";
export const icoWorm = textIcon(urlWorm);
export const icoGlowWorm = textIcon(urlGlowWorm);

/*(
  <img
    src="https://palia.wiki.gg/images/Gold.png?88ce6f"
    style={{ height: "20px", position: "relative", top: "-2px" }}
  />
);*/
