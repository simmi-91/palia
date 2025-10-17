import { useAuth } from "../../context/AuthContext";
import CustomCard from "../../components/display/CustomCard";

import { selectAllFish } from "../../features/slices/FishSlice";
import { selectFavoritesByCategory } from "../../features/slices/FavoritesSlice";

const FishPage = () => {
  const curCategory = "fish";

  const { profile } = useAuth();
  const profileId = profile ? profile.id : "";

  const { data, isLoading, isError, error } = selectAllFish();
  const { data: favoritesData, isLoading: favLoad } = selectFavoritesByCategory(
    profileId,
    curCategory
  );

  if (isLoading || favLoad) {
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
          data.map((item) => {
            const favId =
              favoritesData?.find((f) => f.itemId === item.id)?.favoriteId ?? 0;
            return (
              <CustomCard
                category={curCategory}
                key={item.id}
                dataObject={item}
                isTradeable={false}
                favoriteId={favId}
              />
            );
          })}
      </div>
    </div>
  );
};
export default FishPage;
