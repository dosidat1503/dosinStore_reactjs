import useGlobalVariableContext from "../../../../context_global_variable/context_global_variable";
import clsx from "clsx";
import style from "./productItem.module.scss";

const ProductItem = ({ infoProduct }) => {
  const { formatPrice } = useGlobalVariableContext();

  return infoProduct.map((item, index) => {
    return (
      <tr key={index}>
        <td className="col-2">
          <img
            className={clsx(
              style.productImage,
              "rounded",
              "mx-auto",
              "d-block"
            )}
            src={item.imgURL}
            alt=""
          />
        </td>
        <td className="col-4">
          <span className="fw-bold">{item.TENSP}</span>
          <br />
          <span>
            {item.TENMAU}, {item.MASIZE}
          </span>
        </td>
        <td className="col-2">{formatPrice(item.GIABAN)}</td>
        <td className="col-2">{item.SOLUONG}</td>
        <td className="col-2">{formatPrice(item.TONGGIA)}</td>
      </tr>
    );
  });
};

export default ProductItem;
