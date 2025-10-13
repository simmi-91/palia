import { selectAllStickers } from "../../features/slices/StickerSlice";
import CustomCard from "../../components/display/CustomCard";

const StickersPage = () => {
  const { data, isLoading, isError, error } = selectAllStickers();
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
          <div>
            Can be traded at Sticker Trading Kiosk available in the Underground.
          </div>
        </div>
      </div>

      <div className="row d-flex g-2 my-2">
        {data &&
          data.map((item) => (
            <CustomCard
              category="stickers"
              key={item.id}
              dataObject={item}
              isTradeable={true}
            />
          ))}
      </div>
    </div>
  );
};
export default StickersPage;
