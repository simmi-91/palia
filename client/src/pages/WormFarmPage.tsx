import { Fragment, useEffect, useState } from "react";
import { selectAllFoods } from "../features/slices/FoodSlice";
import type { FOOD_entry, FoodDetail } from "../app/types/types";
import {
  textIcon,
  icoCoin,
  icoStar,
  icoFocus,
  icoWorm,
  icoGlowWorm,
} from "../app/icons/common";

const WormFarmPage = () => {
  const FoodsArr = selectAllFoods();

  const [searchName, setSearchName] = useState("");
  const [sortOn, setSortOn] = useState("");
  const [sortDir, setSortDir] = useState("desc");
  const [filteredData, setFilteredData] = useState([...FoodsArr]);
  const [suggestions, setSuggestions] = useState<FOOD_entry[]>([]);

  const filterFoods = () => {
    let defaultVal = -999;
    let data = [...FoodsArr];

    if (searchName) {
      data = data.filter((food) =>
        food.food.toLowerCase().includes(searchName.toLowerCase())
      );
      setSuggestions(data.slice(0, 10));
    } else {
      setSuggestions([]);
    }

    if (sortOn === "") {
      setFilteredData([...data]);
      return;
    }

    if (sortOn === "name") {
      let sorted = [...data].sort((a, b) => {
        let aVal = a.food;
        let bVal = b.food;

        if (sortDir === "asc") {
          return aVal.localeCompare(bVal);
        } else {
          return bVal.localeCompare(aVal);
        }
      });
      setFilteredData([...sorted]);
    } else {
      let sorted = [...data].sort((a, b) => {
        let aObj = a.star ? a.star : a.base;
        let bObj = b.star ? b.star : b.base;
        let aVal: number = defaultVal;
        let bVal: number = defaultVal;

        if (sortOn === "gold") {
          aVal = aObj.goldValue ? aObj.goldValue : defaultVal;
          bVal = bObj.goldValue ? bObj.goldValue : defaultVal;
        } else if (sortOn === "worm") {
          aVal = aObj.worms.wormOutput ? aObj.worms.wormOutput : defaultVal;
          bVal = bObj.worms.wormOutput ? bObj.worms.wormOutput : defaultVal;
        } else if (sortOn === "glowworms") {
          aVal = aObj.glowworms.wormOutput
            ? aObj.glowworms.wormOutput
            : defaultVal;
          bVal = bObj.glowworms.wormOutput
            ? bObj.glowworms.wormOutput
            : defaultVal;
        } else if (sortOn === "focus") {
          aVal = aObj.focusAmount ? aObj.focusAmount : defaultVal;
          bVal = bObj.focusAmount ? bObj.focusAmount : defaultVal;
        }

        if (sortDir === "asc") {
          return aVal - bVal;
        } else {
          return bVal - aVal;
        }
      });
      setFilteredData([...sorted]);
    }
  };

  useEffect(() => {
    if (FoodsArr.length > 0) {
      filterFoods();
    }
  }, [sortOn, sortDir, searchName]);

  const filterBar = () => {
    return (
      <div className="row my-2 g-2">
        <div className="col-sm">
          <div className="form-floating">
            <input
              type="text"
              className="form-control"
              id="searchName"
              placeholder="Search by name..."
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              list="suggestionsList"
            />
            <label htmlFor="searchName">Search by name...</label>
            <datalist id="suggestionsList">
              {suggestions.map((food) => (
                <option key={food.food} value={food.food} />
              ))}
            </datalist>
          </div>
        </div>
        <div className="col-sm">
          <div className="form-floating">
            <select
              className="form-select"
              id="selectSortBy"
              aria-label="Select Sort by"
              defaultValue={sortOn}
              onChange={(e) => {
                setSortOn(e.target.value);
              }}
            >
              <option>Select to sort</option>
              <option value="name">Food name</option>
              <option value="gold">Gold</option>
              <option value="focus">Focus</option>
              <option value="worm">Worms</option>
              <option value="glowworms">GlowWorms</option>
            </select>
            <label htmlFor="selectSortBy">Sort by ...</label>
          </div>
        </div>
        <div className="col-sm">
          <div className="form-floating">
            <select
              className="form-select"
              id="selectSortDir"
              aria-label="Select sort direction"
              defaultValue={sortDir}
              onChange={(e) => {
                setSortDir(e.target.value);
              }}
            >
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>
            <label htmlFor="selectSortDir">Sort direction</label>
          </div>
        </div>
      </div>
    );
  };

  const detailRow = (key: string, blnStar: boolean, entry: FoodDetail) => {
    return (
      <div className="row text-end border-top" key={key}>
        <div className="col">{blnStar ? icoStar : ""}</div>
        <div className="col">
          {entry.goldValue}
          {icoCoin}
        </div>
        {entry.focusAmount ? (
          <div className="col">
            {entry.focusAmount}
            {icoFocus}
          </div>
        ) : (
          <div className="col"></div>
        )}

        <div className="col border-start">
          {entry.worms.wormOutput}
          {icoWorm}
        </div>
        {entry.worms.fertilizerType ? (
          <div className="col" title={entry.worms.fertilizerType}>
            {entry.worms.fertilizerOutput}
            {textIcon(
              "https://palia.wiki.gg/images/" +
                entry.worms.fertilizerType +
                "_Fertilizer.png"
            )}
          </div>
        ) : (
          <div className="col"></div>
        )}

        <div className="col border-start">
          {entry.glowworms.wormOutput}
          {icoGlowWorm}
        </div>

        {entry.glowworms.fertilizerType ? (
          <div className="col" title={entry.glowworms.fertilizerType}>
            {entry.glowworms.fertilizerOutput}
            {textIcon(
              "https://palia.wiki.gg/images/" +
                entry.glowworms.fertilizerType +
                "_Fertilizer.png"
            )}
          </div>
        ) : (
          <div className="col"></div>
        )}
      </div>
    );
  };

  const foodRow = (i: number, entry: FOOD_entry) => {
    const key = entry.food.replace(/\s/, "_").toLowerCase();
    return (
      <Fragment key={i}>
        <div className="row border-top border-2 pt-1" key={key + "_main"}>
          <div className="col-8">
            <b>{entry.food}</b>
          </div>
          <div className="col-4 text-end">{entry.category}</div>
        </div>
        {detailRow(key + "_base", false, entry.base)}
        {entry.star ? detailRow(key + "_star", true, entry.star) : null}
      </Fragment>
    );
  };

  if (filteredData) {
    return (
      <div className="container-fluid overflow-auto ">
        {filterBar()}
        {filteredData.map((entry, i) => foodRow(i, entry))}
      </div>
    );
  }

  return <>nothing...</>;
};

export default WormFarmPage;
