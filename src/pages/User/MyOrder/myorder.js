import "./myorder.css";
import "bootstrap/dist/css/bootstrap.css";
import React from "react";

import request from "../../../utils/request";
import { useEffect, useState } from "react";
import OrderNavigation from "./OrderNavigation/orderNavigation";
import OrderList from "./OrderList/orderList";

export const statusName = {
  delivered: "Đã Giao",
  received: "Đã nhận",
  canceled: "Đã Huỷ",
  delivering: "Đang Giao",
  prepareing: "Chuẩn Bị Hàng",
};

function MyOrder() {
  useEffect(() => {
    document.title = "DosiIn | Đơn hàng";
  }, []);
  const numberOrderEachPage = 20;
  const [paginationNumberRunFirst, setPaginationNumberRunFirst] = useState(0);
  const [watchOrderDetail, setWatchOrderDetail] = useState(false);

  const createStatus = (nameState) => ({
    nameState,
    orderList: [],
    pageQuantity: 0,
    paginationList: [],
    openingPage: 1,
    hasLoadFirtTime: 0,
    hasChangeFromPreState: 0,
    spaceGetDataFromOrderList: [
      {
        paginationNumber: 1,
        ordinalNumber: 1,
        startIndex: 0,
        endIndex: numberOrderEachPage,
      },
    ],
  });

  const [orderStatusObject, setOrderStatusObject] = useState({
    prepareing: createStatus(statusName.prepareing),
    delivering: createStatus(statusName.delivering),
    delivered: createStatus(statusName.delivered),
    canceled: createStatus(statusName.canceled),
  });
  const OrderStatusArray = Object.entries(orderStatusObject).map(
    ([key, value]) => ({
      key: key,
      value: value,
    })
  );
  const [orderStatusPointer, setOrderStatusPointer] = useState(
    orderStatusObject.prepareing.nameState
  );

  const getInfoOrderForUsers = (itemInOrderStatusArray, openingPage) => {
    const queryForGetInfoOrderForUsers = {
      start: numberOrderEachPage * (openingPage - 1),
      tenTrangThai: itemInOrderStatusArray.value.nameState,
      numberOrderEachPage: numberOrderEachPage,
      matk: localStorage.getItem("auth_matk"),
    };

    try {
      request
        .get(`/api/getInfoMyOrder`, { params: queryForGetInfoOrderForUsers })
        .then((res) => {
          setOrderStatusObject((prevOrderStatus) => {
            const itemIndex = prevOrderStatus[
              itemInOrderStatusArray.key
            ].spaceGetDataFromOrderList.findIndex(
              (item) => item.paginationNumber === openingPage
            );
            if (
              itemIndex === -1 ||
              (openingPage === 1 && paginationNumberRunFirst === 0)
            ) {
              setPaginationNumberRunFirst(1);
              return {
                ...prevOrderStatus,
                [itemInOrderStatusArray.key]: {
                  ...prevOrderStatus[itemInOrderStatusArray.key],
                  orderList: [
                    ...prevOrderStatus[
                      itemInOrderStatusArray.key
                    ].orderList.filter((item) => item),
                    ...res.data.orderList_DB.filter((item) => item),
                  ],
                  spaceGetDataFromOrderList: [
                    ...orderStatusObject[itemInOrderStatusArray.key]
                      .spaceGetDataFromOrderList,
                    {
                      paginationNumber: openingPage,
                      ordinalNumber:
                        orderStatusObject[itemInOrderStatusArray.key]
                          .spaceGetDataFromOrderList.length + 1,
                      startIndex:
                        orderStatusObject[itemInOrderStatusArray.key].orderList
                          .length,
                      endIndex:
                        res.data.orderList_DB.length +
                        orderStatusObject[itemInOrderStatusArray.key].orderList
                          .length,
                    },
                  ],
                },
              };
            } else {
              return {
                ...prevOrderStatus,
              };
            }
          });
        });
    } catch (err) {
      console.log(err);
    }
  };

  const getQuantityOrderToDevidePage = () => {
    const data = {
      matk: localStorage.getItem("auth_matk"),
    };
    request
      .get("/api/getQuantityOrderToDevidePage__myOder", { params: data })
      .then((res) => {
        res.data.quantity.forEach((itemStatusFromDB) => {
          OrderStatusArray.forEach((itemStatus) => {
            if (
              itemStatusFromDB.TRANGTHAI_DONHANG === itemStatus.value.nameState
            ) {
              const pageQuantityShow = Math.ceil(
                itemStatusFromDB.SL_MADH / numberOrderEachPage
              );

              let arrAddToPaginationList = [];
              for (let i = 1; i <= pageQuantityShow; i++)
                arrAddToPaginationList.push(i);
              setOrderStatusObject((prevOrderStatus) => ({
                ...prevOrderStatus,
                [itemStatus.key]: {
                  ...prevOrderStatus[itemStatus.key],
                  pageQuantity: itemStatusFromDB.SL_MADH,
                  paginationList: arrAddToPaginationList,
                },
              }));
            }
          });
        });
      });
  };

  useEffect(() => {
    OrderStatusArray.map((item) => getInfoOrderForUsers(item, 1));
    getQuantityOrderToDevidePage();
  }, []);

  return (
    <div class="container">
      <div class="heading text-uppercase text-center">
        <h1>Đơn hàng</h1>
      </div>
      <OrderNavigation
        orderStatusArray={OrderStatusArray}
        orderStatusPointer={orderStatusPointer}
        setWatchOrderDetail={setWatchOrderDetail}
        setOrderStatusPointer={setOrderStatusPointer}
        setOrderStatusObject={setOrderStatusObject}
        getInfoOrderForUsers={getInfoOrderForUsers}
      ></OrderNavigation>

      <OrderList
        OrderStatusArray={OrderStatusArray}
        orderStatusPointer={orderStatusPointer}
        orderStatusObject={orderStatusObject}
        watchOrderDetail={watchOrderDetail}
        setWatchOrderDetail={setWatchOrderDetail}
        setOrderStatusObject={setOrderStatusObject}
        getInfoOrderForUsers={getInfoOrderForUsers}
      />
    </div>
  );
}

export default MyOrder;
