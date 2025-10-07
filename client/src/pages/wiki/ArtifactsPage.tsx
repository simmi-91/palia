import { selectAllArtifacts } from "../../features/slices/ArtifactsSlice";
import CustomCard from "../../components/display/CustomCard";

const ArtifactsPage = () => {
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
      <div className="row d-flex g-2 my-2">
        {data &&
          data.map((item) => (
            <CustomCard category="artifacts" key={item.id} dataObject={item} />
          ))}
      </div>
    </div>
  );
};
export default ArtifactsPage;
