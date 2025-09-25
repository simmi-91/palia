const ProfitCard = () => {
  const data = [
    {
      name: "Preserves Jar",
      url: "https://palia.wiki.gg/images/Preserves_Jar.png",
      ingredients: [
        {
          name: "Apple",
          url: "https://palia.wiki.gg/images/Apple.png",
        },
        {
          name: "Blueberries",
          url: "https://palia.wiki.gg/images/Blueberries.png",
        },
        {
          name: "Carrot",
          url: "https://palia.wiki.gg/images/Carrot.png",
        },
        {
          name: "Corn",
          url: "https://palia.wiki.gg/images/Corn.png",
        },
        {
          name: "Onion",
          url: "https://palia.wiki.gg/images/Onion.png",
        },
        {
          name: "Tomato",
          url: "https://palia.wiki.gg/images/Tomato.png",
        },
        {
          name: "Spicy Pepper",
          url: "https://palia.wiki.gg/images/Spicy_Pepper.png",
        },
        {
          name: "Rockhopper Pumpkin",
          url: "https://palia.wiki.gg/images/Rockhopper_Pumpkin.png",
        },
        {
          name: "Napa Cabbage",
          url: "https://palia.wiki.gg/images/Napa_Cabbage.png",
        },
      ],
    },
    {
      name: "Seed Collector",
      url: "https://palia.wiki.gg/images/Seed_Collector.png",
      ingredients: [
        {
          name: "Cotton",
          url: "https://palia.wiki.gg/images/Cotton.png",
        },
        {
          name: "Bok Choy",
          url: "https://palia.wiki.gg/images/Bok_Choy.png",
        },
        {
          name: "Potato",
          url: "https://palia.wiki.gg/images/Potato.png",
        },
        {
          name: "Rice",
          url: "https://palia.wiki.gg/images/Rice.png",
        },
        {
          name: "Wheat",
          url: "https://palia.wiki.gg/images/Wheat.png",
        },
        {
          name: "Batterfly Beans",
          url: "https://palia.wiki.gg/images/Batterfly_Beans.png",
        },
        {
          name: "Napa Cabbage",
          url: "https://palia.wiki.gg/images/Napa_Cabbage.png",
        },
      ],
    },
  ];

  return (
    <>
      {data.map((item, i) => (
        <div key={i} className="card m-2 ">
          <div className="row g-0 text-s">
            <div className="col-sm-3 col-md-2 align-content-center justify-content-center">
              <img
                src={item.url}
                alt={item.name}
                className="img-fluid"
                style={{ height: "100px" }}
              />
            </div>
            <div className="col align-content-center">
              <h5 className="card-title">{item.name}</h5>
              <div className="card-text d-flex flex-wrap ">
                {item.ingredients.map((ingredient) => (
                  <div className="">
                    <img
                      style={{ height: "50px" }}
                      src={ingredient.url}
                      alt={ingredient.name}
                    />
                    <label className="d-none d-lg-inline">
                      {ingredient.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};
export default ProfitCard;
