import clsx from "clsx";
import style from "./paymentInfo.module.scss";

import { defaultDeliveryFee, HCMDeliveryFee } from "../payment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import useGlobalVariableContext from "../../../../context_global_variable/context_global_variable";
import { useState } from "react";

export const transportVoucher = "Vận chuyển";

const wrongVoucher = "Nhập sai mã voucher";
const outOfUseVoucher = "Voucher hết lượt sử dụng";
const notEnoughMin = "Giá trị đơn hàng không đạt tối thiểu";

const PaymentInfo = (props) => {
  const { infoForPayment, infoToSaveOrder, setInfoToSaveOrder } = props;
  const {
    deliveryFee,
    totalProductAmount,
    discountVoucher,
    totalPayable,
    deliveryFeeBeforeApplyVoucher,
    paymentMethod,
    inputvouchers,
  } = infoToSaveOrder;

  const { formatPrice } = useGlobalVariableContext();
  const [voucherError, setVoucherError] = useState("");
  const isDisableApplyVoucher =
    discountVoucher > 0 ||
    (deliveryFee !== defaultDeliveryFee && deliveryFee !== HCMDeliveryFee);
  const voucherDiscountPercent =
    deliveryFee === defaultDeliveryFee || deliveryFee === HCMDeliveryFee
      ? formatPrice(parseInt(discountVoucher * totalProductAmount))
      : formatPrice(parseInt(deliveryFeeBeforeApplyVoucher - deliveryFee));

  const handleChooseMethodPayment = (e) => {
    setInfoToSaveOrder({ ...infoToSaveOrder, paymentMethod: e.target.value });
  };

  const handleInputVoucher = (e) => {
    setInfoToSaveOrder({ ...infoToSaveOrder, inputVoucher: e.target.value });
  };

  const handleApplyVoucher = (e) => {
    const item =
      infoForPayment.infoVoucher.find(
        (item) => item.MAVOUCHER === inputvouchers
      ) || null;

    if (item === null) setVoucherError(wrongVoucher);
    else {
      const voucherCase = {
        outOfUse: item.SOLUONG_CONLAI === 0,
        transportVoucher: item.PHANLOAI_VOUCHER === transportVoucher,
      };

      if (voucherCase.outOfUse) {
        setVoucherError(outOfUseVoucher);
      } else if (voucherCase.transportVoucher) {
        if (totalProductAmount < item.GIATRI_DH_MIN) {
          setVoucherError(notEnoughMin);
        } else {
          const deliveryFeeCaculated =
            deliveryFee - item.GIATRIGIAM * deliveryFee;

          const totalPayableCaculated =
            totalProductAmount + deliveryFee - item.GIATRIGIAM * deliveryFee;

          const discountVoucherCaculated = parseFloat(item.GIATRIGIAM);

          setInfoToSaveOrder({
            ...infoToSaveOrder,
            discountVoucher: discountVoucherCaculated,
            deliveryFee: deliveryFeeCaculated,
            totalPayable: totalPayableCaculated,
            deliveryFeeBeforeApplyVoucher: deliveryFee,
          });
        }
      } else if (!voucherCase.transportVoucher) {
        if (totalProductAmount < item.GIATRI_DH_MIN) {
          setVoucherError(notEnoughMin);
        } else {
          if (totalProductAmount * item.GIATRIGIAM > item.GIATRI_GIAM_MAX) {
            const discountVoucherCaculated =
              item.GIATRI_GIAM_MAX / totalProductAmount;
            const totalPayableCaculated =
              totalProductAmount +
              deliveryFee -
              totalProductAmount * discountVoucherCaculated;

            setInfoToSaveOrder({
              ...infoToSaveOrder,
              discountVoucher: discountVoucherCaculated,
              totalPayable: totalPayableCaculated,
            });
          } else {
            const discountVoucherCaculated = parseFloat(item.GIATRIGIAM);
            const totalPayableCaculated =
              totalProductAmount +
              deliveryFee -
              totalProductAmount * item.GIATRIGIAM;

            setInfoToSaveOrder({
              ...infoToSaveOrder,
              discountVoucher: discountVoucherCaculated,
              totalPayable: totalPayableCaculated,
            });
          }
        }
      }
    }
  };

  return (
    <div>
      <div
        className={clsx(style.voucherContainer, "row", "justify-content-end")}
      >
        <div className={clsx("col-3", style.verticalCenter)}>
          <span>Mã Voucher:</span>
        </div>
        <div className="col-4">
          <input
            type="text"
            className="form-control"
            value={inputvouchers}
            onChange={handleInputVoucher}
            disabled={discountVoucher > 0}
          />
        </div>
        <div className={clsx("col-2", style.verticalCenter)}>
          <button
            onClick={handleApplyVoucher}
            className={clsx(style.applyVoucherButton, {
              ["display_hidden"]: isDisableApplyVoucher,
            })}
          >
            Áp dụng
          </button>
          <FontAwesomeIcon
            icon={faCheckCircle}
            className={clsx(style.iconApplyVoucherSuccess, {
              ["display_hidden"]: !isDisableApplyVoucher,
            })}
          ></FontAwesomeIcon>
        </div>
      </div>
      <div className="row justify-content-end" style={{ marginTop: "10px" }}>
        <div className={clsx("col-3", style.verticalCenter)}>
          <span>Số tiền Voucher giảm:</span>
        </div>
        <div className="col-4">
          <span className={style.discountPriceText}>
            {discountVoucher === 0
              ? discountVoucher
              : `-${voucherDiscountPercent} đ`}
          </span>
        </div>
        <div className="col-2 text-start"></div>
      </div>
      <div className="row justify-content-end">
        <div className={clsx("col-3", style.verticalCenter)}>
          <span>Tổng tiền sản phẩm:</span>
        </div>
        <div className="col-4">
          <span className={style.discountPriceText}>
            {formatPrice(totalProductAmount || 0)} đ
          </span>
        </div>
        <div className="col-2 text-start"></div>
      </div>
      <div className="row justify-content-end">
        <div className={clsx("col-3", style.verticalCenter)}>
          <span>Phí vận chuyển:</span>
        </div>
        <div className="col-4">
          <span>{formatPrice(deliveryFee)} đ</span>
        </div>
        <div className={clsx("col-2", "text-start")}></div>
      </div>
      <div className="row justify-content-end">
        <div className={clsx("col-3", style.verticalCenter)}>
          <span>Tổng số tiền thanh toán:</span>
        </div>
        <div className="col-4">
          <span className={clsx("fw-bold", style.discountPriceText)}>
            {totalPayable === "" ? "" : formatPrice(parseInt(totalPayable))}đ
          </span>
        </div>
        <div className={clsx("col-2", "text-start")}></div>
      </div>
      <div className="row justify-content-end" style={{ marginTop: "10px" }}>
        <div className={clsx("col-3", style.verticalCenter)}>
          <span>Phương thức thanh toán</span>
        </div>
        <div className="col-4">
          <select
            className={clsx("form-select", style.selectContainer)}
            required
            name="paymentMethod"
            onChange={handleChooseMethodPayment}
            value={paymentMethod}
          >
            <option selected value="Thanh toán khi nhận hàng">
              Thanh toán khi nhận hàng
            </option>
            <option value="Chuyển khoản">Chuyển khoản</option>
          </select>
        </div>
        <div className="col-2"></div>
      </div>
    </div>
  );
};

export default PaymentInfo;
