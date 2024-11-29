import clsx from "clsx";
import style from "./baseInfo.module.scss";
import useGlobalVariableContext from "../../../../context_global_variable/context_global_variable";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { faStar as farStarRegular } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const {
  importantInfo,
  priceContainer,
  sellPrice,
  originPrice,
  space,
  rateContainer,
  notHasRate,
  solidStar,
  regularStar,
} = style;

const BaseInfo = ({ baseInfo, showStarQuantity }) => {
  const { formatPrice } = useGlobalVariableContext();
  const { TENSP, GIABAN, GIAGOC } = baseInfo;
  console.log(baseInfo, "baseInfo");
  const maxStar = 5;

  const renderStar = () => {
    let stars = [];

    for (let i = 1; i <= maxStar; i++)
      if (i <= showStarQuantity.solidStar)
        stars.push(
          <FontAwesomeIcon
            icon={faStar}
            className={solidStar}
          ></FontAwesomeIcon>
        );
      else
        stars.push(
          <FontAwesomeIcon
            icon={farStarRegular}
            className={regularStar}
          ></FontAwesomeIcon>
        );

    return stars;
  };

  return (
    <>
      <h4>{TENSP}</h4>
      <div className={importantInfo}>
        <div className={priceContainer}>
          <span className={clsx(sellPrice, space)}>
            {GIABAN ? formatPrice(GIABAN) : ""}₫
          </span>
          <span className={clsx(originPrice, space)}>
            {GIABAN ? formatPrice(GIAGOC) : ""}₫
          </span>
          <span className={space}>
            {100 - parseInt((GIABAN / GIAGOC) * 100)}%
          </span>
        </div>
        <div className={rateContainer}>
          {renderStar()}
          <span className={notHasRate}>
            {showStarQuantity.solidStar === 0 ? "(Chưa có đánh giá)" : ""}
          </span>
        </div>
      </div>
    </>
  );
};

export default BaseInfo;
