import CustomCard from "../../components/display/CustomCard";

import { selectAllArtifacts } from "../../features/slices/ArtifactsSlice";

const ArtifactsPage = () => {
  const curCategory = "artifacts";

  const { data, isLoading, isError, error } = selectAllArtifacts();

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
          <div>Can be traded at booths available at Elderwood Central</div>
        </div>
      </div>
      <div className="row d-flex g-2 my-1">
        {data &&
          data.map((item) => {
            return (
              <CustomCard
                category={curCategory}
                key={item.id}
                dataObject={item}
                isTradeable={true}
                favoriteId={0}
              />
            );
          })}
      </div>
    </div>
  );
};
export default ArtifactsPage;
