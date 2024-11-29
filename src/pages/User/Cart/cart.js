import "bootstrap/dist/css/bootstrap.css";
import style from "./cart.module.scss";

import { useEffect, useState } from "react";
import request from "../../../utils/request";
import HeaderCard from "./HeaderCard/headerCard";
import BodyCard from "./BodyCard/bodyCard";
import FooterCard from "./FooterCard/footerCard";
import clsx from "clsx";

const { containerContent, textHeaderContent, tbodyTableCart } = style;

function Cart() {
  useEffect(() => {
    document.title = "DosiIn | Giỏ hàng";
  }, []);

  const [isCheckedAll, setIsCheckedAll] = useState(false);
  const [itemCarts, setItemCart] = useState([]);
  const [tongTienAllItem, setTongTienAllItem] = useState(0);

  const handleGetListProductCart = () => {
    request
      .get(`/api/cartInfo`, {
        params: { matk: localStorage.getItem("auth_matk") },
      })
      .then((res) => {
        const infoCartReverse = [...res.data.data].reverse();
        setItemCart(infoCartReverse);

        setIsCheckedAll(
          infoCartReverse.every((itemCarts) => itemCarts.SELECTED)
        );
        let tinhtongtien = 0;
        infoCartReverse.map(
          (item) => (tinhtongtien = tinhtongtien + item.TONGGIA)
        );
        setTongTienAllItem(tinhtongtien);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  useEffect(() => {
    handleGetListProductCart();
  }, []);

  return (
    <div className={clsx("container", "mt-3", containerContent)}>
      <h1 className={textHeaderContent}>GIỎ HÀNG</h1>
      <div className={tbodyTableCart}>
        <table className="table table-hover">
          <HeaderCard
            isCheckedAll={isCheckedAll}
            itemCarts={itemCarts}
            setTongTienAllItem={setTongTienAllItem}
            setIsCheckedAll={setIsCheckedAll}
          />
          <BodyCard
            setItemCart={setItemCart}
            setIsCheckedAll={setIsCheckedAll}
            setTongTienAllItem={setTongTienAllItem}
            itemCarts={itemCarts}
          />
        </table>
      </div>
      <FooterCard tongTienAllItem={tongTienAllItem} />
    </div>
  );
}
export default Cart;
