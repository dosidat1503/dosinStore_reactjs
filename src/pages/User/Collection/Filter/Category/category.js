import { useEffect, useState } from "react";
import sortBystyle from "../SortBy/sortBy.module.scss";
import { useNavigate } from "react-router-dom";
import request from "../../../../../utils/request";
import clsx from "clsx";

const { filterContainer, title, options, button, buttonActive } = sortBystyle;

const Category = ({ category, params, fashionType }) => {
  const [categoryList, setCategoryList] = useState([]);
  const navigate = useNavigate();
  const handleClickCategory = (id) => {
    params.set("category", id);
    navigate(`?${params.toString()}`);
  };
  const getCategory = () => {
    request
      .get(`api/getCategory`, {
        params: { fashionType: fashionType },
      })
      .then((res) => {
        setCategoryList(res.data.categoryList);
        console.log(res.data.categoryList, "categoryList");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getCategory();
  }, [fashionType]);

  const renderCategoryList = categoryList.map((item, index) => {
    item.MAPL2 === category &&
      console.log(item.MAPL2, category, "item.id === category");
    return (
      <button
        key={index}
        className={clsx(button, {
          [buttonActive]: item.MAPL2 === category,
        })}
        onClick={() => handleClickCategory(item.MAPL2)}
      >
        {item.TENPL2}
      </button>
    );
  });

  return (
    <div className={filterContainer}>
      <div>
        <span className={title}>Danh mục: </span>
      </div>
      <div className={options}>{renderCategoryList}</div>
    </div>
  );
};

export default Category;
