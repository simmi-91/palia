import { selectAllFish } from "../../features/slices/FishSlice";
import CustomCard from "../../components/display/CustomCard";

const FishPage = () => {
  const { data, isLoading, isError, error } = selectAllFish();
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
          <div></div>
        </div>
      </div>

      <div className="row d-flex g-2 my-2">
        {data &&
          data.map((item) => (
            <CustomCard
              category="fish"
              key={item.id}
              dataObject={item}
              isTradeable={false}
            />
          ))}
      </div>
    </div>
  );
};
export default FishPage;
