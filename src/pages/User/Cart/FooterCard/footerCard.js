import style from "./footerCard.module.scss";
import useGlobalVariableContext from "../../../../context_global_variable/context_global_variable";
import { useNavigate } from "react-router-dom";
import clsx from "clsx";

const {
  btnContinue,
  boxPayment,
  linePayment,
  boxPaymentTongTien,
  total,
  boxPaymentButton,
  btnPaymentCart,
  contentBottom,
} = style;

const FooterCard = ({ tongTienAllItem }) => {
  const { formatPrice } = useGlobalVariableContext();
  const Navigate = useNavigate();

  const handleClickPayment = () => {
    Navigate("/payment");
  };

  const handleContinuelyBuy = () => {
    // Navigate("/payment");
  };

  return (
    <div className={clsx("container mt-5", contentBottom)}>
      <div>
        <button className={btnContinue} onClick={handleContinuelyBuy}>
          Tiếp tục mua sắm
        </button>
      </div>
      <div className={boxPayment}>
        <hr className={linePayment} />
        <div className={boxPaymentTongTien}>
          <p>
            <b>Tổng tiền</b>
          </p>
          <p className={total}>
            <b>{formatPrice(tongTienAllItem)}đ</b>
          </p>
        </div>
        <div className={boxPaymentButton}>
          <button className={btnPaymentCart} onClick={handleClickPayment}>
            THANH TOÁN
          </button>
        </div>
      </div>
    </div>
  );
};

export default FooterCard;
