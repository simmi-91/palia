import { selectAllPlushies } from "../../features/slices/PlushiesSlice";

import CustomCard from "../../components/display/CustomCard";

const PlushiesPage = () => {
  const { data, isLoading, isError, error } = selectAllPlushies();
  if (isLoading) {
    return (
      <div className={" text-center"}>
        <div className="spinner-border text-dark" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className={" text-center"}>
        <div className="text-danger">Error loading data: {error.message}</div>
      </div>
    );
  }

  return (
    <div className="container-fluid ">
      <div className="row d-flex g-2 my-2">
        {data &&
          data.map((item) => (
            <CustomCard
              id={item.id}
              title={item.name}
              rarity={item.rarity}
              description=""
              imgsrc={item.image}
              url={item.url}
              multiListTitle={"How to obtain"}
              multiListArr={item.howToObtain}
            />
          ))}
      </div>
    </div>
  );
};
export default PlushiesPage;
