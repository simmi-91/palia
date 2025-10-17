import { useAuth } from "../../context/AuthContext";
import CustomCard from "../../components/display/CustomCard";
import {
  LoadingState,
  ErrorState,
  EmptyCategoryState,
} from "../../components/CommonStates";

import { selectAllBugs } from "../../features/slices/BugsSlice";
import { selectFavoritesByCategory } from "../../features/slices/FavoritesSlice";

const BugsPage = () => {
  const curCategory = "bugs";

  const { profile } = useAuth();
  const profileId = profile ? profile.id : "";

  const { data, isLoading, isError, error } = selectAllBugs();
  const { data: favoritesData, isLoading: favLoad } = selectFavoritesByCategory(
    profileId,
    curCategory
  );

  if (isLoading || favLoad) {
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
export default BugsPage;
