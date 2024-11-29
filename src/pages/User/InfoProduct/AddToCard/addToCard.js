import useGlobalVariableContext from "../../../../context_global_variable/context_global_variable";
import style from "./addToCard.module.scss";
import { useState } from "react";
import request from "../../../../utils/request";
import { useNavigate } from "react-router-dom";
import clsx from "clsx";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";

const AddToCard = ({
  infoProduct,
  selectPropertyProduct,
  buttonAddToCartRef,
  hetHang,
  setHetHang,
  id,
}) => {
  const { infoCarts, setStatusPressAddToCart } = useGlobalVariableContext();
  const Navigate = useNavigate();

  var dataAddProductToCart = {
    matk: 0,
    masp: 0,
    mamau: 0,
    masize: "",
    soluongsp: 1,
    tonggia: 1,
  };

  const [contentPopup, setContentPopup] = useState({
    title: "",
    content: "",
  });

  const openPopup = () => {
    const popupOverlay = document.querySelector(".popup-overlay");
    const popupContainer = document.querySelector(".popup-container");

    popupOverlay.style.display = "flex";
    setTimeout(() => {
      popupContainer.style.opacity = "1";
      popupContainer.style.transform = "scale(1)";
    }, 100);
  };

  const closePopup = () => {
    const popupContainer = document.querySelector(".popup-container");
    popupContainer.style.opacity = "0";
    popupContainer.style.transform = "scale(0.8)";
    setTimeout(() => {
      const popupOverlay = document.querySelector(".popup-overlay");
      popupOverlay.style.display = "none";
    }, 300);
  };
  const handleAddToCart = (e) => {
    e.preventDefault();
    if (localStorage.getItem("auth_matk")) {
      if (
        selectPropertyProduct.mamau === 0 ||
        selectPropertyProduct.masize === ""
      ) {
        setContentPopup({
          title: "Thêm hàng vào giỏ",
          content: "Hãy chọn size và màu sắc trước khi thêm sản phẩm vào giỏ",
        });
        openPopup();
      } else {
        let i = 0;
        let soLuongMua = selectPropertyProduct.soluong;
        infoProduct.data_xacDinhSoLuong.forEach((item) => {
          if (
            item.MAMAU === selectPropertyProduct.mamau &&
            item.MASIZE === selectPropertyProduct.masize &&
            item.SOLUONG === 0
          ) {
            setHetHang(true);
            i++;
          }
          if (
            item.MAMAU === selectPropertyProduct.mamau &&
            item.MASIZE === selectPropertyProduct.masize &&
            item.SOLUONG < soLuongMua
          )
            soLuongMua = item.SOLUONG;
        });
        if (i === 0) {
          dataAddProductToCart = {
            matk: localStorage.getItem("auth_matk"),
            masp: id,
            mamau: selectPropertyProduct.mamau,
            masize: selectPropertyProduct.masize,
            soluongsp: soLuongMua,
            tonggia: soLuongMua * infoProduct.data_sanpham.GIABAN,
          };
          // console.log()
          let found = false;

          infoCarts.map((item) => {
            if (
              item.MASP === parseInt(dataAddProductToCart.masp) &&
              item.MATK === parseInt(dataAddProductToCart.matk) &&
              item.MAMAU === parseInt(dataAddProductToCart.mamau) &&
              item.MASIZE === dataAddProductToCart.masize
            ) {
              try {
                request
                  .post(`api/updateQuantityProductInCart`, dataAddProductToCart)
                  .then((res) => {
                    setStatusPressAddToCart(
                      (statusPressAddToCart) => !statusPressAddToCart
                    );
                  });
              } catch (err) {
                console.log(err);
              }
              found = true;
            }
          });
          if (!found) {
            try {
              request
                .post("/api/addToCart", dataAddProductToCart)
                .then((res) => {
                  setStatusPressAddToCart(
                    (statusPressAddToCart) => !statusPressAddToCart
                  );
                });
            } catch (err) {
              console.log(err);
            }
          }

          setTimeout(() => {
            setStatusPressAddToCart(false);
          }, 3000); // Thay đổi giá trị thời gian theo nhu cầu của bạn
        }
      }
    } else {
      Navigate("/login");
    }
  };
  return (
    <div>
      <div className="popup-overlay">
        <div className="popup-container">
          <div className="popup-card">
            <h2>{contentPopup.title}</h2>
            <p>{contentPopup.content}</p>
            <button id="close-popup" onClick={closePopup}>
              {contentPopup.title !== "" && "Đóng"}
            </button>
          </div>
        </div>
      </div>
      {infoProduct.data_xacDinhSoLuong.map((item, index) => (
        <div
          key={index}
          className={clsx({
            ["display_hidden"]:
              selectPropertyProduct.mamau !== item.MAMAU ||
              selectPropertyProduct.masize !== item.MASIZE,
          })}
        >
          Số lượng còn lại: {item.SOLUONG}
        </div>
      ))}
      <div className={style.addToCartContainer}>
        <button
          className={style.cardAdditionButton}
          ref={buttonAddToCartRef}
          onClick={handleAddToCart}
        >
          <FontAwesomeIcon
            icon={faCartShopping}
            className={style.cartIcon}
          ></FontAwesomeIcon>
          <p className={style.cartText}>THÊM VÀO GIỎ</p>
        </button>
      </div>
      <div className={clsx({ ["display_hidden"]: !hetHang })}>Hết hàng</div>
    </div>
  );
};

export default AddToCard;
