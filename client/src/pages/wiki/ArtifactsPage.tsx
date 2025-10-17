import { useState, useEffect } from "react";

import {
  LoadingState,
  ErrorState,
  EmptyCategoryState,
} from "../../components/CommonStates";
import CustomCard from "../../components/display/CustomCard";

import { selectAllArtifacts } from "../../features/slices/ArtifactsSlice";

const ArtifactsPage = () => {
  const curCategory = "artifacts";

  const [selectedBundle, setSelectedBundle] = useState("all");

  const { data, isLoading, isError, error } = selectAllArtifacts();
  const [filteredData, setFilteredData] = useState(data ? [...data] : []);
  const bundle = ["ancient", "umbraan", "wartorn"];

  useEffect(() => {
    if (data) {
      let localData = [...data];
      if (selectedBundle != "all") {
        localData = localData.filter((item) => {
          return item.name
            ?.toLowerCase()
            .includes(selectedBundle.toLowerCase());
        });
      }
      setFilteredData(localData);
    }
  }, [data, selectedBundle]);

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
          <div>Can be traded at booths available at Elderwood Central</div>
        </div>
      </div>

      <div className="row d-flex my-1 ">
        <div className="col">
          <div className="row"></div>
          <div className="row">
            <div className="col d-flex flex-wrap">
              <div className="me-1 pb-1 align-content-center">Bundle</div>
              <button
                key="all"
                className={`btn btn-outline-dark py-1 px-3 me-1 mb-1 ${selectedBundle === "all" && "btn-info"}`}
                onClick={() => setSelectedBundle("all")}
              >
                All
              </button>

              {bundle.map((item) => {
                return (
                  <button
                    key={item}
                    className={`btn btn-outline-dark p-1 me-1 mb-1 text-capitalize ${selectedBundle === item && "btn-info"}`}
                    onClick={() => {
                      selectedBundle === item
                        ? setSelectedBundle("all")
                        : setSelectedBundle(item);
                    }}
                  >
                    {item}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="row d-flex g-2 my-1">
        {filteredData &&
          filteredData.map((item) => {
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
