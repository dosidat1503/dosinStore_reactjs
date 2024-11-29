import { useLocation } from "react-router-dom";
import Category from "./Category/category";
import SortBy from "./SortBy/sortBy";

const Filter = ({ sortBy, category, query, notHaveProduct, fashionType }) => {
  const params = new URLSearchParams(useLocation().search);

  return (
    <>
      <div className={`row ${query === null ? "" : "d-hidden"}`}>
        <Category
          params={params}
          category={category}
          fashionType={fashionType}
        />
      </div>
      <div
        className={`row ${
          query !== null && notHaveProduct === 0 ? "d-hidden" : ""
        }`}
      >
        <SortBy sortBy={sortBy} params={params}></SortBy>
      </div>
    </>
  );
};

export default Filter;
