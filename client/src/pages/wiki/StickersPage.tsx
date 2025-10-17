import {
  LoadingState,
  ErrorState,
  EmptyCategoryState,
} from "../../components/CommonStates";
import CustomCard from "../../components/display/CustomCard";

import { selectAllStickers } from "../../features/slices/StickerSlice";

const StickersPage = () => {
  const curCategory = "stickers";

  const { data, isLoading, isError, error } = selectAllStickers();

  if (isLoading) {
    return <LoadingState color="dark" />;
  }
  if (isError) {
    return <ErrorState error={error} />;
  }
  if (!data) {
    return <EmptyCategoryState />;
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
              category={curCategory}
              key={item.id}
              dataObject={item}
              isTradeable={true}
              favoriteId={0}
            />
          ))}
      </div>
    </div>
  );
};
export default StickersPage;
