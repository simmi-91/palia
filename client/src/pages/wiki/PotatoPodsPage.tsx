import { useState, useEffect } from "react";

import {
  LoadingState,
  ErrorState,
  EmptyCategoryState,
} from "../../components/CommonStates";
import CustomCard from "../../components/display/CustomCard";

import { selectAllPotatoPods } from "../../features/slices/PotatoPodsSlice";

const PotatoPodsPage = () => {
  const curCategory = "potatopods";

  const [selectedFamily, setSelectedFamily] = useState("all");

  const { data, isLoading, isError, error } = selectAllPotatoPods();
  const [filteredData, setFilteredData] = useState(data ? [...data] : []);
  useEffect(() => {
    if (data) {
      let localData = [...data];
      if (selectedFamily != "all") {
        localData = localData.filter((item) =>
          item.family.toLowerCase().includes(selectedFamily.toLowerCase())
        );
      }
      setFilteredData(localData);
    }
  }, [data, selectedFamily]);

  if (isLoading) {
    return <LoadingState color="dark" />;
  }
  if (isError) {
    return <ErrorState error={error} />;
  }
  if (!data) {
    return <EmptyCategoryState />;
  }

  const family = [...new Set(data?.map((item) => item.family).filter(Boolean))];

  return (
    <div className="container-fluid ">
      <div className="row d-flex my-1 ">
        <div className="col">
          <div>Can be traded at booths available in the Underground.</div>
        </div>
      </div>

      <div className="row d-flex my-1 ">
        <div className="col">
          <div className="row">
            <div className="col d-flex flex-wrap">
              <div className="me-1 pb-1 align-content-center">Family</div>
              <button
                key="all"
                className={`btn btn-outline-dark py-1 px-3 me-1 mb-1 ${selectedFamily === "all" && "btn-info"}`}
                onClick={() => setSelectedFamily("all")}
              >
                All
              </button>

              {family.map((item) => {
                return (
                  <button
                    key={item}
                    className={`btn btn-outline-dark p-1 me-1 mb-1 ${selectedFamily === item && "btn-info"}`}
                    onClick={() => {
                      selectedFamily === item
                        ? setSelectedFamily("all")
                        : setSelectedFamily(item);
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

      <div className="row d-flex g-2 my-2">
        {filteredData &&
          filteredData.map((item) => (
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
export default PotatoPodsPage;
