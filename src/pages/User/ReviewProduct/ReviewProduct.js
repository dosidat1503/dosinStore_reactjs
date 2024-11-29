import "./ReviewProduct.css";
import "bootstrap/dist/css/bootstrap.css";
import request from "../../../utils/request";
import images from "../../../assets/images";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faFaceAngry } from "@fortawesome/free-regular-svg-icons";
import {
  faCircleChevronLeft,
  faL,
  faPaperPlane,
  faStar,
  faUser,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";

function ReviewProduct() {
  useEffect(() => {
    document.title = "DosiIn | Đánh giá sản phẩm";
  }, []);
  //isCheckedAll xử lý khi tất cả sản phẩm trong giỏ hàng được chọn để thanh toán
  const [isCheckedAll, setIsCheckedAll] = useState(false);
  //itemCarts chứa thông tin từng sản phẩm trong giỏ hàng để hiển thị ra màn hình và thao tác
  const [itemCarts, setItemCart] = useState([]);
  const [tongTienAllItem, setTongTienAllItem] = useState(0);
  const [isReviewAll, setIsReviewAll] = useState(false);
  //sử dụng để chuyển hướng web
  const Navigate = useNavigate();
  const searchParams = new URLSearchParams(window.location.search);
  const madh = searchParams.get("madh");
  const [infoReviewAll, setInfoReviewAll] = useState({
    starQuantity: 0,
    contentReview: [],
  });
  const handleInputContentReview = (index, e) => {
    if (index === itemCarts.length) {
      setInfoReviewAll({ ...infoReviewAll, contentReview: e.target.value });
    } else {
      setItemCart((prevItemCarts) => {
        const updatedItemCarts = [...prevItemCarts];
        updatedItemCarts[index] = {
          ...updatedItemCarts[index],
          contentReview: e.target.value,
        };
        return updatedItemCarts;
      });
    }
  };
  const handleClickCheckboxAll = () => {
    itemCarts.forEach((item) => {
      !isCheckedAll ? (item.SELECTED = 1) : (item.SELECTED = 0);
    });
    setIsCheckedAll(!isCheckedAll);
    console.log(itemCarts, "okokokok");
  };

  const handleClickCheckbox = (index) => {
    const listItemCarts = [...itemCarts];
    listItemCarts[index].SELECTED = listItemCarts[index].SELECTED === 0 ? 1 : 0;

    setItemCart((prevItemCarts) => {
      const updatedItemCarts = [...prevItemCarts];
      updatedItemCarts[index] = {
        ...updatedItemCarts[index],
        SELECTED: listItemCarts[index].SELECTED,
      };
      return updatedItemCarts;
    });
    setIsCheckedAll(listItemCarts.every((itemCarts) => itemCarts.SELECTED));
  };

  const handleClickSaveReview = (item, index) => {
    let infoSaveReview = {
      madh: madh,
      maxdsp: 1,
      masp: 1,
      soluongsao: 5,
      noidungdanhgia: "cảm ơn",
      matk: localStorage.getItem("auth_matk"),
    };
    if (index === itemCarts.length) {
      infoSaveReview = {
        madh: madh,
        maxdsp: itemCarts.map((item) => item.MAXDSP),
        soluongsao: infoReviewAll.starQuantity,
        noidungdanhgia: infoReviewAll.contentReview,
        matk: localStorage.getItem("auth_matk"),
        masp: itemCarts[0].MASP,
      };
    } else {
      infoSaveReview = {
        madh: madh,
        maxdsp: [item.MAXDSP],
        soluongsao: item.starQuantity,
        noidungdanhgia: item.contentReview,
        matk: localStorage.getItem("auth_matk"),
        masp: item.MASP,
      };
    }
    request.post("/api/saveReviewProduct", infoSaveReview).then((res) => {
      console.log(res.data.message);

      if (index === itemCarts.length) {
        itemCarts.splice(0, itemCarts.length);
      } else {
        itemCarts.splice(index, 1);
      }
      const listItemCarts = [...itemCarts];
      setItemCart(listItemCarts);
    });
  };

  const handleGetListProductCart = () => {
    const data = {
      madh: madh,
    };
    request
      .get(`/api/infoOrderDetail_myOder`, { params: data })
      .then((res) => {
        const infoCartReverse = res.data.data_sanPham_relative_CTDH.map(
          (item) => {
            return {
              ...item,
              starQuantity: 0,
              contentReview: "",
              SELECTED: 0,
            };
          }
        );
        setItemCart(infoCartReverse);

        setIsCheckedAll(
          infoCartReverse.every((itemCarts) => itemCarts.SELECTED)
        );
        let tinhtongtien = 0;
        infoCartReverse.map(
          (item) => (tinhtongtien = tinhtongtien + item.TONGGIA)
        );
        setTongTienAllItem(tinhtongtien);
        if (res.data.data_sanPham_relative_CTDH.length === 0)
          setIsReviewAll(true);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  useEffect(() => {
    handleGetListProductCart();
  }, []);

  const handleRating = (value, index) => {
    if (isCheckedAll && index === itemCarts.length) {
      setInfoReviewAll({ ...infoReviewAll, starQuantity: value });
    } else if (!isCheckedAll && index !== itemCarts.length) {
      setItemCart((prevItemCarts) => {
        const updatedItemCarts = [...prevItemCarts];
        updatedItemCarts[index] = {
          ...updatedItemCarts[index],
          starQuantity: value,
        };
        return updatedItemCarts;
      });
    }
  };

  const handleDirectory = (route) => {
    if (route === "Trang chủ") window.location.href = `/`;
    else if (route === "Đơn hàng") window.location.href = `/myorder`;
  };

  const handleTurnBack = () => {
    Navigate("/myorder");
  };

  useEffect(() => {
    if (isCheckedAll) {
      setItemCart((prevItemCarts) => {
        const updatedItemCarts = prevItemCarts.map((item) => ({
          ...item,
          starQuantity: 0,
          contentReview: "",
        }));
        return updatedItemCarts;
      });
    } else {
      setInfoReviewAll({
        starQuantity: 0,
        contentReview: "",
      });
    }
  }, [isCheckedAll]);

  const renderStar = (item, index) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <FontAwesomeIcon
          icon={faStar}
          key={i}
          onClick={() => handleRating(i, index)}
          style={{
            color:
              i <=
              (index === itemCarts.length
                ? infoReviewAll.starQuantity
                : item.starQuantity)
                ? "gold"
                : "gray",
            cursor: "pointer",
          }}
        />
      );
    }
    return stars;
  };

  const renderInfoCart = itemCarts.map((item, index) => {
    return (
      <tr class="row1" key={index}>
        <td>
          <input
            type="checkbox"
            name="checkboxProductInCart"
            id=""
            checked={item.SELECTED === 1 ? true : false}
            onChange={() => handleClickCheckbox(index)}
          />
        </td>

        <td class="rowitem">
          <div class="box-row1-column1">
            <div class="row1-column1-item">
              <img class="img-row1" src={item.imgURL} alt="" />
            </div>
            <div class="row1-column1-item" id="itemm">
              <p>
                {item.TENSP} <br />
                Màu: {item.TENMAU} <br />
                Size: {item.MASIZE}
              </p>
            </div>
          </div>
        </td>
        <td>
          <div class="box-row1-column2 box-row1">{renderStar(item, index)}</div>
        </td>
        <td>
          <div class="box-row1-column3 box-row1" id="box_review">
            <textarea
              placeholder="Nhập đánh giá của bạn..."
              value={item.contentReview}
              onChange={(e) => handleInputContentReview(index, e)}
              style={{
                width: "100%",
                height: "100px",
                marginTop: "10px",
                borderRadius: "8px", // Border radius cho ô nhập đánh giá
                padding: "8px", // Thêm padding cho ô nhập để đẹp hơn
              }}
              disabled={isCheckedAll ? true : false}
            />
          </div>
        </td>
        <td>
          <div class="box-row1-column5 box-row1">
            <button
              class="btn-delete"
              id="btn_deletee"
              onClick={() => handleClickSaveReview(item, index)}
              disabled={isCheckedAll ? true : false}
            >
              <FontAwesomeIcon icon={faPaperPlane}></FontAwesomeIcon>
            </button>
          </div>
        </td>
      </tr>
    );
  });

  return (
    <div class="container mt-3 container-content">
      <div className="faCircleChevronLeft_div">
        <span onClick={handleTurnBack} className="faCircleChevronLeft">
          <FontAwesomeIcon
            class={`fa-solid faCircleChevronLeft_reviewProduct`}
            icon={faCircleChevronLeft}
          ></FontAwesomeIcon>
        </span>
      </div>
      <h1 class="text-header-content">Đánh giá sản phẩm</h1>
      <div
        className={`${
          itemCarts.length === 0 && isReviewAll ? "display_hidden" : ""
        }`}
      >
        <div class="tbody_table_cart">
          <table class="table table-hover">
            <thead class="table-header">
              <tr class="table-header-row">
                <th class="header-column0">
                  <input
                    type="checkbox"
                    name="checkboxProductInCart"
                    id=""
                    checked={isCheckedAll}
                    onChange={handleClickCheckboxAll}
                  />
                </th>
                <th class="header-column1">Sản phẩm</th>
                <th class="header-column2">Đánh Giá</th>
                <th class="header-column3">Nội dung đánh giá</th>
                <th class="header-column5"></th>
              </tr>
            </thead>
            <tbody>{renderInfoCart}</tbody>
          </table>
        </div>
        <div class="container mt-5 content-bottom_review">
          <div class="review_all">
            <div class="review_checkbox">
              <input
                type="checkbox"
                name="checkboxProductInCart"
                id=""
                checked={isCheckedAll}
                onChange={handleClickCheckboxAll}
              />
            </div>
            <div class="span_danhgia">Đánh giá tất cả: </div>
          </div>

          <div class="box-row1-column2 box-row1" id="start_1">
            {renderStar(0, itemCarts.length)}
          </div>
          <div class="box-row1-column3 box-row1" id="boxreview">
            <textarea
              placeholder="Nhập đánh giá của bạn..."
              value={infoReviewAll.contentReview}
              onChange={(e) => handleInputContentReview(itemCarts.length, e)}
              style={{
                width: "100%",
                height: "100px",
                marginTop: "10px",
                borderRadius: "8px", // Border radius cho ô nhập đánh giá
                padding: "8px", // Thêm padding cho ô nhập để đẹp hơn
              }}
              disabled={!isCheckedAll ? true : false}
            />
          </div>
          <div class="box-row1-column5 box-row1" id="delete_1">
            <button
              class="btn-delete"
              id="btn_deletee"
              onClick={() => handleClickSaveReview(0, itemCarts.length)}
              disabled={!isCheckedAll ? true : false}
            >
              <FontAwesomeIcon icon={faPaperPlane}></FontAwesomeIcon>
            </button>
          </div>
        </div>
      </div>
      <div className={`${itemCarts.length === 0 ? "" : "display_hidden"}`}>
        Cám ơn bạn đã thực hiện đánh giá
        <div>
          <button className="btn" onClick={() => handleDirectory("Trang chủ")}>
            Trang chủ
          </button>
          <button className="btn" onClick={() => handleDirectory("Đơn hàng")}>
            Đơn hàng
          </button>
        </div>
      </div>
      <div class="container mt-5 content-bottom"></div>
    </div>
  );
}
export default ReviewProduct;
