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
      <div className="row d-flex my-1 ">
        <div className="col">
          <div>Can be traded at booths available in The Underground.</div>
        </div>
      </div>

      <div className="row d-flex g-2 my-2">
        {data &&
          data.map((item) => (
            <CustomCard category="plushies" key={item.id} dataObject={item} />
          ))}
      </div>
    </div>
  );
};
export default PlushiesPage;
