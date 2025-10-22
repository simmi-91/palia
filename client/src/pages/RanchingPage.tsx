import { useState } from "react";

import {
  selectAllTreats,
  selectAllTreatCategories,
} from "../features/slices/RanchingTreatSlice";
import type { TreatEntry } from "../app/types/types";

import RarityTag from "../components/display/RarityTag";
import missingImg from "../assets/images/missing.png";
import { textIcon } from "../app/icons/common";
import { Fragment } from "react/jsx-runtime";

const tRow = (i: number, treat: TreatEntry) => {
  const imgUrl = treat.image ? treat.image : missingImg;
  const cookieIcon = textIcon(imgUrl, 60);

  return (
    <Fragment key={i.toString()}>
      <tr>
        <td>{cookieIcon}</td>

        <td>
          <a
            title="See detailed crop info"
            className="text-decoration-none link-opacity-50-hover link-dark"
          >
            {treat.name}
          </a>
          <div className="text-nowrap">
            <RarityTag number={treat.rarity} />
          </div>
        </td>

        <td>{treat.category.name}</td>

        <td className=" d-none d-lg-table-cell ">
          <div style={{ whiteSpace: "pre-wrap" }}>{treat.description}</div>
        </td>
      </tr>
      <tr className=" d-table-row d-lg-none">
        <td
          colSpan={4}
          style={{ backgroundColor: "rgba(0,0,0,0.1)", whiteSpace: "pre-wrap" }}
        >
          {treat.description}
        </td>
      </tr>
    </Fragment>
  );
};

const RanchingPage = () => {
  const treats = selectAllTreats();
  const treatCategories = selectAllTreatCategories();

  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const [selectedCategory, setSelectedCategory] = useState("all");

  const sortedTreats = [...treats]
    .filter((item) => {
      if (selectedCategory === "all") {
        return item;
      } else {
        return item.category.shape.includes(selectedCategory.toLowerCase());
      }
    })
    .sort((a, b) => {
      if (!sortColumn) return 0;
      let aValue: any;
      let bValue: any;

      switch (sortColumn) {
        case "Name":
          aValue = a.name;
          bValue = b.name;
          break;
        case "Category":
          aValue = a.category.name;
          bValue = b.category.name;
          break;
        default:
          return 0;
      }

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortDirection === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      } else if (typeof aValue === "number" && typeof bValue === "number") {
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
      } else {
        return 0;
      }
    });

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  return (
    <div className="container-fluid ">
      <div className="row d-flex my-1 ">
        <div className="col">
          <div className="row"></div>
          <div className="row">
            <div className="col d-flex flex-wrap">
              <div className="me-1 pb-1 align-content-center">Category</div>
              <button
                key="all"
                className={`btn btn-outline-dark py-1 px-3 me-1 mb-1 ${selectedCategory === "all" && "btn-info"}`}
                onClick={() => setSelectedCategory("all")}
              >
                All
              </button>

              {treatCategories.map((item) => {
                return (
                  <button
                    key={item.shape}
                    className={`btn btn-outline-dark p-1 me-1 mb-1 text-capitalize d-flex flex-column
                      ${selectedCategory === item.shape && "btn-info"}
                    `}
                    onClick={() => {
                      selectedCategory === item.shape
                        ? setSelectedCategory("all")
                        : setSelectedCategory(item.shape);
                    }}
                  >
                    <div className="text-xs">[ {item.shape} ]</div>
                    <div className="flex-fill">{item.name}</div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="row my-1">
        <div className="col-12">
          <div
            id="TreatTable"
            className="container-fluid overflow-x-auto card "
          >
            <table className="table table-hover">
              <thead>
                <tr>
                  <th></th>

                  <th scope="col" onClick={() => handleSort("Name")}>
                    <a
                      title="Sort on Crop"
                      className="text-decoration-none link-opacity-50-hover link-dark"
                    >
                      Name
                      {sortColumn === "Name" &&
                        (sortDirection === "asc" ? " ▲" : " ▼")}
                    </a>
                  </th>

                  <th scope="col" onClick={() => handleSort("Category")}>
                    <a
                      title="Sort on Crop"
                      className="text-decoration-none link-opacity-50-hover link-dark"
                    >
                      Category
                      {sortColumn === "Category" &&
                        (sortDirection === "asc" ? " ▲" : " ▼")}
                    </a>
                  </th>

                  <th className=" d-none d-lg-table-cell">Description</th>
                </tr>
              </thead>
              <tbody>{sortedTreats.map((treat, i) => tRow(i, treat))}</tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
export default RanchingPage;
