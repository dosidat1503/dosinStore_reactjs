import ProductItem from "../ProductItem/productItem";
import style from "./productList.module.scss";

const ProductList = (props) => {
  const { infoProduct } = props;
  return (
    <div className={style.productContainer}>
      <table>
        <tr>
          <th className="ps-5" colspan="2">
            Sản phẩm
          </th>
          <th>Đơn giá</th>
          <th>Số lượng</th>
          <th>Thành tiền</th>
        </tr>
        <ProductItem infoProduct={infoProduct} />
      </table>
    </div>
  );
};

export default ProductList;
