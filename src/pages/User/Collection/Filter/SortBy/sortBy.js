import { useNavigate } from "react-router-dom";
import style from "./sortBy.module.scss";
import clsx from "clsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";

const {
  filterContainer,
  title,
  options,
  button,
  buttonActive,
  priceOptions,
  priceContainer,
  priceText,
  priceIcon,
} = style;

const SortBy = ({ sortBy, params }) => {
  const navigate = useNavigate();
  const handleClickSort = (id) => {
    console.log(params, "params", sortBy);
    params.set("sortBy", id);
    navigate(`?${params.toString()}`);
  };
  const sortTypeList = [
    {
      id: "moinhat",
      name: "Mới nhất",
    },
    {
      id: "banchay",
      name: "Bán chạy",
    },
    {
      id: "thapDenCao",
      name: "Thấp đến cao",
    },
    {
      id: "caoDenThap",
      name: "Cao xuống thấp",
    },
  ];

  const renderSortByList = sortTypeList.slice(0, 2).map((item, index) => {
    return (
      <button
        key={index}
        className={clsx(button, {
          [buttonActive]: item.id === sortBy,
        })}
        onClick={() => handleClickSort(item.id)}
      >
        {item.name}
      </button>
    );
  });

  const renderSortByListCaretDown = sortTypeList.slice(2).map((item, index) => {
    return (
      <div
        key={index}
        className={clsx(button, {
          [buttonActive]: item.id === sortBy,
        })}
      >
        <span
          className={clsx(button, {
            [buttonActive]: item.id === sortBy,
          })}
          onClick={() => handleClickSort(item.id)}
        >
          {item.name}
        </span>
      </div>
    );
  });

  return (
    <div className={filterContainer}>
      <div>
        <span className={title}>Sắp xếp theo</span>
      </div>
      <div className={options}>
        {renderSortByList}

        <div className={priceContainer}>
          <span className={priceText}>
            Giá
            <div className={priceOptions}>{renderSortByListCaretDown}</div>
          </span>
          <FontAwesomeIcon
            icon={faAngleDown}
            className={priceIcon}
          ></FontAwesomeIcon>
        </div>
      </div>
    </div>
  );
};

export default SortBy;
