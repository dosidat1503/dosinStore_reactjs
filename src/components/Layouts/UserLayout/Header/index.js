import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-regular-svg-icons";
import {
  faArrowRightFromBracket,
  faCaretDown,
  faCartShopping,
  faFileInvoiceDollar,
  faMagnifyingGlass,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

import "./index.css";

import "bootstrap/dist/css/bootstrap.css";

import Navigation from "../HeaderNavigation/Navigation";

import useGlobalVariableContext from "../../../../context_global_variable/context_global_variable";

import request from "../../../../utils/request";

import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

function Header({ settoggleFunctionLoginLogout }) {
  const {
    setLoginOrLogout,
    textQuery,
    setTextQuery,
    setResultQuery,
    statusPressAddToCart,
    divPopupCartRef,
    infoCarts,
    setInfoCarts,
    setIsClickedPayment,
    formatPrice,
  } = useGlobalVariableContext();

  const Navigate = useNavigate();
  const [hasLogin, setHasLogin] = useState(false);

  const bodyPopupCart = useRef(null);

  const scrollToTop = () => {
    bodyPopupCart.current.scrollTop = 0;
  };

  useEffect(() => {
    request
      .get(`/api/cartInfo`, {
        params: { matk: localStorage.getItem("auth_matk") },
      })
      .then((res) => {
        setInfoCarts([...res.data.data].reverse());
        console.log(res);
      })
      .catch((e) => {
        console.log(e);
      });
    scrollToTop();
  }, [statusPressAddToCart]);

  //2 useEffect khá giống nhau đều là lấy giữ liệu, nhưng cái trên thì lấy dữ liệu trong popup khi trạng thái statusPressAddToCart thay đổi
  //còn cái này thì sẽ kiểm tra xem có tài khoản đăng  nhập chưa, nếu có thì sẽ lấy thông tin trong giỏ hàng
  //của người đó ra hiển thị
  useEffect(() => {
    if (localStorage.getItem("auth_token")) {
      setHasLogin(true);
    } else {
      setHasLogin(false);
    }

    request
      .get(`/api/cartInfo`, {
        params: { matk: localStorage.getItem("auth_matk") },
      })
      .then((res) => {
        console.log(res, "infoCart");
        setInfoCarts([...res.data.data].reverse());
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  //click ở phía quản lý tài khoản, trong trạgn thái logout thì đăng ký đăng nhập
  const clickSignUp = (event) => {
    event.preventDefault();
    setLoginOrLogout("signUp");
    Navigate("/login");
  };
  const clickSignIn = (event) => {
    event.preventDefault();
    setLoginOrLogout("signIn");
    Navigate("/login");
  };

  //click ở phía quản lý tài khoản, trong trạgn thái login, đăng nhập thì logout
  const clickInfoAccount = (event) => {
    event.preventDefault();
    Navigate("/infoAccount");
  };

  const clickMyOrder = (e) => {
    Navigate("/myorder");
  };

  // khi logout thì sẽ xoá dữ liệu được lưu trong localsorage
  const clickLogout = (event) => {
    event.preventDefault();
    // axios.post('http://localhost:8000/api/logout', {}, {
    //         headers: {
    //         'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
    //         }})
    // .then(res => {
    //     if(res.data.status === 200)
    //     {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_email");
    localStorage.removeItem("auth_matk");
    // swal("Success",res.data.message,"success");
    // console.log(res.data.message);
    Navigate("/login");
    //     }
    // })
    // .catch(err => {
    //     console.log(err)
    // })
    setHasLogin(false);
  };

  const handleClickDelete = (index) => {
    const infoDeleteItemCart = {
      matk: parseInt(localStorage.getItem("auth_matk")),
      masp: infoCarts[index].MASP,
      mamau: infoCarts[index].MAMAU,
      masize: infoCarts[index].MASIZE,
    };
    console.log(infoDeleteItemCart);
    request.post("/api/deleteItemCart", infoDeleteItemCart).then((res) => {
      console.log(res.data.message);
    });

    infoCarts.splice(index, 1);
    const listItemCarts = [...infoCarts];
    setInfoCarts(listItemCarts);
  };

  const handleSearchProduct = (e) => {
    request
      .get(`/api/search?query=${textQuery}`)
      .then((res) => {
        setResultQuery(res.data.data);
        console.log(res.data.data, "header");
        Navigate(`/collection?query=${textQuery}`);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const renderInfoCart = () => {
    return infoCarts.map((item, index) => {
      if (infoCarts !== null) {
        const url = `/infoProduct?id=${item.MASP}`;
        return (
          <li class="header__body__cart__orders__item_body" key={index}>
            <a href={url}>
              <img
                src={item.imgURL}
                alt=""
                class="header__body__cart__orders__item__image"
              />
            </a>
            <div class="header__body__cart__orders__item__info">
              <div>
                <a href={url}>
                  <span class="header__body__cart__orders__item__info__title">
                    {item.TENSP}
                  </span>
                </a>
              </div>
              <div>
                <span class="header__body__cart__orders__item__info__product_type">
                  Màu:
                  <span class="header__body__cart__orders__item__info__type">
                    {item.TENMAU}
                  </span>
                </span>
                <span class="header__body__cart__orders__item__info__product_type">
                  Size:
                  <span class="header__body__cart__orders__item__info__type">
                    {item.MASIZE}
                  </span>
                </span>
              </div>
            </div>
            <div class="header__body__cart__orders__item__price_total">
              <div class="header__body__cart__orders__item_price_x_quantiry">
                <span class="header__body__cart__orders__item__price_x_quantiry__price">
                  {formatPrice(item.TONGGIA)}
                </span>
                <span class="header__body__cart__orders__item__price_x_quantiry__price">
                  đ
                </span>
                <div class="header__body__cart__orders__item__price_x_quantiry__x1">
                  <span class="header__body__cart__orders__item__price_x_quantiry__price__multiply">
                    x
                  </span>
                  <span class="header__body__cart__orders__item__price_x_quantiry__quantity">
                    {item.SOLUONG}
                  </span>
                </div>
              </div>
              <div class="header__body__cart__orders__item__button_delete_div">
                <button
                  class="header__body__cart__orders__item__button_delete"
                  onClick={() => handleClickDelete(index)}
                >
                  Xoá
                </button>
              </div>
            </div>
          </li>
        );
      }
    });
  };

  const handleXemGioHang = () => {
    Navigate("/cart");
  };

  const handleThanhToan = () => {
    setIsClickedPayment(1);
    Navigate("/payment");
  };

  const handleClickLogo = () => {
    Navigate("/");
  };

  const renderTongTienTatCaSP = () => {
    let tongTienTatCaSanPham = 0;
    infoCarts.map((item) => {
      tongTienTatCaSanPham += item.TONGGIA;
    });

    return (
      <span className="tongtien_cartpopup">
        {" "}
        {formatPrice(tongTienTatCaSanPham)} đ
      </span>
    );
  };
  return (
    <header class="header_block">
      <div class="container">
        <div class="header_body row">
          <div class="header_body__logo col-sm-2">
            <img
              src="https://dosi-in.com/images/assets/icons/logo.svg"
              alt="logo dosi-in"
              type="link"
              onClick={handleClickLogo}
            />
          </div>
          <div class="header_body__search col-sm-7">
            <div class="header_body__search__div_css">
              {/* ở đây có onChange */}
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm"
                class="header_body__search__input"
                name="searchProduct"
                onChange={(e) => setTextQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearchProduct();
                  }
                }}
              />

              {/* ở đây có  onClick*/}
              <button
                class="header_body__search__button"
                onClick={handleSearchProduct}
              >
                <FontAwesomeIcon
                  icon={faMagnifyingGlass}
                  className="faMagnifyingGlass_header"
                ></FontAwesomeIcon>
              </button>
            </div>
          </div>
          <div class="header_body__option_and_info col-sm-3">
            <div class="header_body__option_and_info__div_css">
              {/* <button class="header_body__option_and_info__button">
                <FontAwesomeIcon icon={faHeart} />
              </button> */}
              <div className="header__body__cart">
                <button class="header_body__option_and_info__button_cart">
                  <FontAwesomeIcon icon={faCartShopping}></FontAwesomeIcon>
                </button>
                <div
                  ref={divPopupCartRef}
                  className={`header__body__cart__orders ${
                    statusPressAddToCart ? "show" : ""
                  }`}
                >
                  <header class="header__body__cart__orders__header">
                    <p class="header__body__cart__orders__text_header">
                      Sản phẩm đã thêm
                    </p>
                  </header>
                  <ul
                    class="header__body__cart__orders__body"
                    ref={bodyPopupCart}
                  >
                    {renderInfoCart()}
                  </ul>
                  <div className="header__body__cart__orders__footer_tongtien">
                    Tổng tiền:
                    {renderTongTienTatCaSP()}
                  </div>
                  <footer class="header__body__cart__orders__footer">
                    <button
                      class="header__body__cart__orders__watch_cart_button"
                      onClick={handleThanhToan}
                    >
                      Thanh toán
                    </button>
                    <button
                      class="header__body__cart__orders__watch_cart_button"
                      onClick={handleXemGioHang}
                    >
                      Xem giỏ hàng
                    </button>
                  </footer>
                </div>
              </div>

              <div class="header_body__option_and_info__user__div_css">
                <button class="header_body__option_and_info__button">
                  <FontAwesomeIcon icon={faUser}></FontAwesomeIcon>
                </button>
                <div class="header_body__option_and_info__user__text">
                  <span class="header_body__option_and_info__user__text_taikhoan">
                    Tài khoản
                  </span>
                  <span class="header_body__option_and_info__user__text_xinchao">
                    Xin chào!
                  </span>
                </div>
                <FontAwesomeIcon icon={faCaretDown}></FontAwesomeIcon>
                <div class="header_body__option_and_info__user__select_login_or_logout">
                  <button
                    class="header_body__option_and_info__user__select_login_or_logout__in"
                    onClick={hasLogin ? clickInfoAccount : clickSignIn}
                  >
                    <FontAwesomeIcon
                      icon={faUser}
                      className="fa_icon_header"
                    ></FontAwesomeIcon>
                    {hasLogin ? "Tài khoản" : "Đăng nhập"}
                  </button>
                  <button
                    class={`header_body__option_and_info__user__select_login_or_logout__in ${
                      hasLogin ? "" : "display_hidden"
                    }`}
                    onClick={hasLogin ? clickMyOrder : ""}
                  >
                    <FontAwesomeIcon
                      icon={faFileInvoiceDollar}
                      className="fa_icon_header"
                    ></FontAwesomeIcon>
                    {hasLogin ? "Đơn hàng" : ""}
                  </button>
                  <button
                    class="header_body__option_and_info__user__select_login_or_logout__in"
                    onClick={hasLogin ? clickLogout : clickSignUp}
                  >
                    <FontAwesomeIcon
                      icon={faArrowRightFromBracket}
                      className="fa_icon_header"
                    ></FontAwesomeIcon>
                    {hasLogin ? "Đăng Xuất" : "Đăng ký"}
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div></div>
        </div>
        <Navigation />
      </div>
    </header>
  );
}
export default Header;
//123
