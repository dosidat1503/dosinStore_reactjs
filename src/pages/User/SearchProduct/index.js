import "./index.css";
import "bootstrap/dist/css/bootstrap.css";
import request from "../../../utils/request";
import { useEffect, useState } from "react";
import useGlobalVariableContext from "../../../context_global_variable/context_global_variable";

function SearchProduct() {
  // trang này hiển thị thông tin sản phẩm tìm kiếm được khi search ở thanh tìm kiếm trong header
  // sau đó sử dụng các bộ lọc để lọc sản phẩm
  // sau khi đọc các trang trước thì trang này mọi người có thể soi code để hiểu
  const { formatPrice } = useGlobalVariableContext();

  useEffect(() => {
    document.title = "DosiIn | Tìm kiếm";
  }, []);

  const { resultQuery, setResultQuery, textQuery, setTextQuery } =
    useGlobalVariableContext();

  const [filter, setFilter] = useState("");
  const [listFilter, setListFilter] = useState([
    "moinhat",
    "banchay",
    "thapDenCao",
    "caoDenThap",
  ]);

  const handleClickFilter = (type) => {
    setFilter(type);
    console.log(type);
    const dataForFilterSearch = {
      filter: type,
      textQuery: textQuery,
      giatri: 1,
    };
    console.log(dataForFilterSearch);
    request
      .get(`/api/filterSearchProduct`, { params: dataForFilterSearch })
      .then((res) => {
        console.log(res, "lk11");
        setResultQuery(res.data.data_product);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {}, []);

  const product = () => {
    if (Array.isArray(resultQuery)) {
      return resultQuery.map((product) => {
        const url = `/infoProduct?id=${product.MASP}`;
        return (
          <div key={product.MASP} class="product_item_div__out">
            <a href={url}>
              <div class="product_item_div__in">
                <div>
                  <img
                    src={product.imgURL}
                    alt="sản phẩm test"
                    width="247.5"
                    height="250"
                    class="product_item__img"
                  />
                </div>
                <div class="product_item__summary">
                  <a href="#">
                    <h6 class="product_item__summary__title">
                      {product.TENSP}
                    </h6>
                  </a>
                  <div class="product_item__summary__price_and_heart">
                    <div class="product_item__summary__price">
                      <span class="product_item__summary__sale_price space_item_in_a_row">
                        {formatPrice(product.GIABAN)}₫
                      </span>
                      <span class="product_item__summary__origin_price space_item_in_a_row">
                        <del>{formatPrice(product.GIAGOC)}₫</del>
                      </span>
                    </div>
                    <div></div>
                  </div>
                </div>
                <div class="grid__column_10__product_thumbail__yeuthich">
                  <i class="fa-solid fa-check grid__column_10__product_thumbail__yeuthich__check_icon"></i>
                  <span class="grid__column_10__product_thumbail__text_yeuthich">
                    {formatPrice(
                      parseInt(100 - (product.GIABAN / product.GIAGOC) * 100)
                    )}
                    %
                  </span>
                </div>
              </div>
            </a>
          </div>
        );
      });
    }
  };

  return (
    <div class="container">
      {/* <!-- show_product hiển thị phần "SẢN PHẨM MỚI"--> */}
      <div class="show_product__title_div">
        <h1 class="show_product__title">Sản phẩm tìm thấy</h1>
      </div>
      <div className="row">
        <div class="grid__column_10__filter">
          <div class="grid__column_10__filter__div_title">
            <span class="grid__column_10__filter__text_title">
              Sắp xếp theo
            </span>
          </div>
          <div class="grid__column_10__filter__div_result_filter_select">
            {/* <button class="grid__column_10__filter__result_filter_button grid__column_10__filter__result_filter_button--active">Phổ Biến</button> */}
            <button
              className={`
                            grid__column_10__filter__result_filter_button 
                            ${
                              filter === listFilter[0]
                                ? "grid__column_10__filter__result_filter_button--active"
                                : ""
                            }   
                        `}
              onClick={() => handleClickFilter(`${listFilter[0]}`)}
            >
              Mới Nhất
            </button>
            <button
              class={`
                    grid__column_10__filter__result_filter_button
                    ${
                      filter === listFilter[1]
                        ? "grid__column_10__filter__result_filter_button--active"
                        : ""
                    }   
                `}
              onClick={() => handleClickFilter(`${listFilter[1]}`)}
            >
              Bán chạy
            </button>
            <div class="grid__column_10__filter__div_result_filter_select__sort_price">
              <span class="grid__column_10__filter__div_result_filter_select__text_sort_price">
                Giá
                <div class="grid__column_10__filter__div_result_filter_select__select_text_sort_price">
                  <div
                    className={`${
                      filter === listFilter[2]
                        ? "grid__column_10__filter__result_filter_button--active"
                        : ""
                    }`}
                  >
                    <span
                      class={`
                            header__body__search_and_recommend__search__selection_scope__in 
                            header__body__search_and_recommend__search__selection_scope__in_shop
                            // ${
                              filter === listFilter[2]
                                ? "grid__column_10__filter__result_filter_button--active"
                                : ""
                            }   
                        `}
                      onClick={() => handleClickFilter(`${listFilter[2]}`)}
                    >
                      Thấp Đến Cao
                      {/* <FontAwesomeIcon icon={faCheck} className="header__body__search_and_recommend__search__selection_scope__icon_in"></FontAwesomeIcon> */}
                    </span>
                  </div>
                  <div
                    className={`${
                      filter === listFilter[3]
                        ? "grid__column_10__filter__result_filter_button--active"
                        : ""
                    }`}
                  >
                    <span
                      class={`
                            header__body__search_and_recommend__search__selection_scope__in 
                            header__body__search_and_recommend__search__selection_scope__in_shop
                            ${
                              filter === listFilter[3]
                                ? "grid__column_10__filter__result_filter_button--active"
                                : ""
                            }   
                        `}
                      onClick={() => handleClickFilter(`${listFilter[3]}`)}
                    >
                      Cao Đến Thấp
                    </span>
                  </div>
                </div>
              </span>
              <svg
                enable-background="new 0 0 11 11"
                viewBox="0 0 11 11"
                x="0"
                y="0"
                class="header__body__search_and_recommend__search__icon_scope"
              >
                <g>
                  <path d="m11 2.5c0 .1 0 .2-.1.3l-5 6c-.1.1-.3.2-.4.2s-.3-.1-.4-.2l-5-6c-.2-.2-.1-.5.1-.7s.5-.1.7.1l4.6 5.5 4.6-5.5c.2-.2.5-.2.7-.1.1.1.2.3.2.4z"></path>
                </g>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div class="show_product">
        <div class="product_item_container__out">
          <div class="product_item_container__in">{product()}</div>
        </div>
      </div>
    </div>
  );
}

export default SearchProduct;
