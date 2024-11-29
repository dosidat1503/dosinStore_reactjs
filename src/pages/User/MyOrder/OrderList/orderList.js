import React from "react";
import style from "./orderList.module.scss";
import useGlobalVariableContext from "../../../../context_global_variable/context_global_variable";
import { useNavigate } from "react-router-dom";
import OrderDetail from "../OrderDetail/orderDetail";
import { useState } from "react";
import request from "../../../../utils/request";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import clsx from "clsx";

const OrderList = ({
  OrderStatusArray,
  orderStatusPointer,
  orderStatusObject,
  watchOrderDetail,
  setWatchOrderDetail,
  setOrderStatusObject,
  getInfoOrderForUsers,
}) => {
  const { formatPrice } = useGlobalVariableContext();
  const Navigate = useNavigate();

  const [infoOrderDetail, setInfoOrderDetail] = useState({
    orderData: [],
    detailOrderData: [],
  });

  const handleWatchOrderDetail = (madh) => {
    getInforOrderDetail(madh);
  };
  const handleReviewProduct = (madh) => {
    Navigate(`/reviewProduct?madh=${madh}`);
  };
  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  const handleClickItemPagination = (itemStatus, itemPagination) => {
    const updateOpeningPage = (prevOrderStatus) => ({
      ...prevOrderStatus,
      [itemStatus.key]: {
        ...prevOrderStatus[itemStatus.key],
        openingPage: itemPagination,
      },
    });
    setOrderStatusObject(updateOpeningPage);
    getInfoOrderForUsers(itemStatus, itemPagination);
    handleScrollToTop();
  };

  const getInforOrderDetail = (madh) => {
    const data = {
      madh: madh,
    };
    request.get(`/api/infoOrderDetail`, { params: data }).then((res) => {
      setInfoOrderDetail({
        orderData: res.data.data_relative_Donhang[0],
        detailOrderData: res.data.data_sanPham_relative_CTDH,
      });
      setWatchOrderDetail(true);
    });
  };

  const Order = ({ item, indexOrder }) => {
    let index = {
      start: 0,
      end: 0,
    };
    item.value.spaceGetDataFromOrderList.filter((item_pagination) => {
      if (item_pagination.paginationNumber === item.value.openingPage) {
        index.start = item_pagination.startIndex;
        index.end = item_pagination.endIndex;
      }
    });
    return item.value.orderList
      .slice(index.start, index.end)
      .map((product, index) => {
        if (product === null) {
          return null;
        } else {
          return (
            <tr key={index}>
              <td data-label="Order-code">{product.MADH}</td>
              <td data-label="Name">{product.TEN}</td>
              <td data-label="Phone-number">{product.SDT}</td>
              <td data-label="Address">
                {product.DIACHI}, {product.PHUONG_XA}, {product.QUAN_HUYEN},{" "}
                {product.TINH_TP}
              </td>
              <td data-label="Day">{product.NGAYORDER}</td>
              <td> {product.HINHTHUC_THANHTOAN} </td>
              <td> {product.TRANGTHAI_THANHTOAN} </td>
              <td data-label="Subtotal">
                {formatPrice(product.TONGTIENDONHANG)}
              </td>
              <td data-label="update">
                <div className={style.iconContainer}>
                  <span onClick={() => handleWatchOrderDetail(product.MADH)}>
                    <FontAwesomeIcon
                      icon={faEye}
                      className={clsx(style.faEye, style.faSolid)}
                    ></FontAwesomeIcon>
                  </span>
                  <span
                    onClick={() => handleReviewProduct(product.MADH)}
                    className={clsx({
                      ["display_hidden"]:
                        orderStatusPointer !==
                        orderStatusObject.delivered.nameState,
                    })}
                  >
                    <FontAwesomeIcon
                      className={clsx(style.faPenToSquare, style.faSolid)}
                      icon={faPenToSquare}
                    ></FontAwesomeIcon>
                  </span>
                </div>
              </td>
            </tr>
          );
        }
      });
  };

  const Pagination = ({ itemStatus }) => {
    return itemStatus.value.paginationList.map((itemPagination) => (
      <button
        key={itemPagination}
        onClick={() => handleClickItemPagination(itemStatus, itemPagination)}
      >
        {itemPagination}
      </button>
    ));
  };

  return OrderStatusArray.map((item, index) => {
    if (orderStatusPointer === item.value.nameState) {
      return (
        <div
          className={`row justify-content-center ${
            orderStatusPointer === item.value.nameState ? "" : "hiddenEachState"
          }`}
          key={index}
        >
          <OrderDetail
            watchOrderDetail={watchOrderDetail}
            infoOrderDetail={infoOrderDetail}
            setWatchOrderDetail={setWatchOrderDetail}
          />
          <div
            className={clsx(style.orderListContent, {
              ["display_hidden"]: watchOrderDetail,
            })}
          >
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">Mã đơn hàng</th>
                  <th scope="col">Tên khách hàng</th>
                  <th scope="col">SĐT</th>
                  <th scope="col">Địa chỉ</th>
                  <th scope="col">Ngày đặt hàng</th>
                  <th scope="col">Hình thức thanh toán</th>
                  <th scope="col">Trạng thái thanh toán</th>
                  <th scope="col">Tổng tiền đơn hàng</th>
                  <th scope="col"></th>
                </tr>
              </thead>
              <tbody className="table-group-divider">
                <Order item={item} index={item} />
              </tbody>
            </table>
          </div>
          <div
            className={clsx(style.paginationContainer, {
              ["display_hidden"]: watchOrderDetail,
            })}
          >
            <Pagination itemStatus={item} />
          </div>
        </div>
      );
    }
  });
};

export default OrderList;
