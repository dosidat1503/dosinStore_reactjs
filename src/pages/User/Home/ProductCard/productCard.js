import style from "./productCard.module.scss";
import useGlobalVariableContext from "../../../../context_global_variable/context_global_variable";
import { useNavigate } from "react-router-dom";

const NEW = "new";

const {
  productOut,
  productIn,
  info,
  image,
  originPrice,
  salePrice,
  saleOff,
  text,
} = style;

const ProductCard = ({ products, type }) => {
  const { formatPrice } = useGlobalVariableContext();
  const Navigation = useNavigate();

  return products.map((item) => {
    const url = `/infoProduct?id=${item.MASP}`;
    return (
      <div
        key={item.MASP}
        className={productOut}
        onClick={() => {
          Navigation(`${url}`);
        }}
      >
        <div className={productIn}>
          <div>
            <img
              src={item.imgURL}
              alt="sản phẩm test"
              width="247.5"
              height="250"
              className={image}
            />
          </div>
          <div className={info}>
            <h6>{item.TENSP}</h6>
            <div>
              <span className={salePrice}>{formatPrice(item.GIABAN)}₫</span>
              <span className={originPrice}>
                <del>{formatPrice(item.GIAGOC)}₫</del>
              </span>
            </div>
          </div>
          <div className={saleOff}>
            {type === NEW ? (
              <span className={text}>
                {formatPrice(parseInt(100 - (item.GIABAN / item.GIAGOC) * 100))}
                %
              </span>
            ) : (
              <span className={text}>HOT</span>
            )}
          </div>
        </div>
      </div>
    );
  });
};

export default ProductCard;
