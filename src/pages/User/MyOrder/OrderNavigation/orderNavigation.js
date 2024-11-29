import React from "react";
import style from "./orderNavigation.module.scss";
import { statusName } from "../myorder";

const OrderNavigation = ({
  orderStatusArray,
  orderStatusPointer,
  setWatchOrderDetail,
  setOrderStatusPointer,
  setOrderStatusObject,
  getInfoOrderForUsers,
}) => {
  const handleClickNavState = (itemStatus, itemPagination) => {
    const { nameState, hasLoadFirtTime, hasChangeFromPreState } =
      itemStatus.value;

    setWatchOrderDetail(false);
    setOrderStatusPointer(nameState);

    if (hasLoadFirtTime === 0 || hasChangeFromPreState === 1) {
      const updateOpeningPage = (prevOrderStatus) => ({
        ...prevOrderStatus,
        [itemStatus.key]: {
          ...prevOrderStatus[itemStatus.key],
          openingPage: itemPagination,
          hasLoadFirtTime: 1,
          hasChangeFromPreState: 0,
        },
      });

      setOrderStatusObject(updateOpeningPage);
      getInfoOrderForUsers(itemStatus, itemPagination);
    }
  };
  return (
    <ul className="nav nav-underline justify-content-center">
      {orderStatusArray.map((item, index) => (
        <li className={`nav-item col-auto p-2`} key={index}>
          <button
            className={`nav-link ${
              orderStatusPointer === item.value.nameState ? "active" : ""
            }`}
            aria-current="page"
            onClick={() => handleClickNavState(item, 1)}
          >
            {item.value.nameState === statusName.delivered
              ? statusName.received
              : item.value.nameState}
          </button>
        </li>
      ))}
    </ul>
  );
};

export default OrderNavigation;
