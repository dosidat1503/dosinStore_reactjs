import style from "./relativeProduct.module.scss";
import Slider from "react-slick";
import "../infoProduct.css";
import useGlobalVariableContext from "../../../../context_global_variable/context_global_variable";
import { useNavigate } from "react-router-dom";

const RelativeProduct = ({ relativeProduct }) => {
  const { formatPrice } = useGlobalVariableContext();
  const navigate = useNavigate();
  const GalleryPrevArrow = ({ currentSlide, slideCount, ...props }) => {
    const { onClick } = props;

    return (
      <div {...props} className={style.customPrevArrow} onClick={onClick}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <path d="M16.67 0l2.83 2.829-9.339 9.175 9.339 9.167-2.83 2.829-12.17-11.996z" />
        </svg>
      </div>
    );
  };

  const GalleryNextArrow = ({ currentSlide, slideCount, ...props }) => {
    const { onClick } = props;

    return (
      <div {...props} className={style.customNextArrow} onClick={onClick}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <path d="M7.33 24l-2.83-2.829 9.339-9.175-9.339-9.167 2.83-2.829 12.17 11.996z" />
        </svg>
      </div>
    );
  };

  const settings = {
    className: "center",
    dots: true,
    infinite: true,
    centerPadding: "60px",
    slidesToShow: 4,
    slidesToScroll: 2,
    swipeToSlide: true,
    nextArrow: <GalleryNextArrow />,
    prevArrow: <GalleryPrevArrow />,
  };

  const renderRelativeProduct = relativeProduct.map((product) => {
    const url = `/infoProduct?id=${product.MASP}`;
    return (
      <div
        key={product.MASP}
        class="product_item_div__out"
        onClick={() => {
          navigate(`${url}`);
        }}
      >
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
                {formatPrice(product.TENSP)}
              </h6>
            </a>
            <div class="product_item__summary__price_and_heart">
              <div class="product_item__summary__price">
                <span class="product_item__summary__sale_price">
                  {formatPrice(product.GIABAN)}₫
                </span>
                <span class="product_item__summary__origin_price">
                  <del>{product.GIAGOC}₫</del>
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
      </div>
    );
  });

  return (
    <div className={style.container}>
      <h1>SẢN PHẨM LIÊN QUAN</h1>
      <div className="align-items-center">
        <Slider {...settings}>
          {renderRelativeProduct}
          {/* <ProductCard products={relativeProduct} type="NEW" /> */}
        </Slider>
      </div>
    </div>
  );
};

export default RelativeProduct;
