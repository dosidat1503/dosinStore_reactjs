import "./payment.css";
import "bootstrap/dist/css/bootstrap.css";
import { useEffect, useState } from "react";
import request from "../../../utils/request";
import useGlobalVariableContext from "../../../context_global_variable/context_global_variable";
import DeliveryInfo from "./DeliveryInfo/deliveryInfo";
import ProductList from "./ProductList/productList";
import PaymentInfo from "./PaymentInfo/paymentInfo";

export const shipInformationInitial = {
  name: "",
  numberPhone: "",
  address: "",
  city: "",
  district: "",
  ward: "",
};
export const defaultDeliveryFee = 25000;
export const HCMDeliveryFee = 20000;
const uncompletePayment = "Chưa thanh toán";
const paying = "Đang thanh toán";
const prepareProduct = "Chuẩn bị hàng";
const payWhenReceive = "Thanh toán khi nhận hàng";

function Payment() {
  useEffect(() => {
    document.title = "DosiIn | Thanh toán";
  }, []);
  const [numberPhoneFormatError, setNumberPhoneFormatError] = useState(false);
  const [isProductSoldOut, setIsProductSoldOut] = useState(false);
  const { isClickedPayment, setIsClickedPayment } = useGlobalVariableContext();
  const [contentPopup, setContentPopup] = useState({
    title: "",
    content: "",
  });
  const [infoForPayment, setInfoForPayment] = useState({
    infoProduct: [],
    infoVoucher: [],
    infoAdress: [],
  });
  const [isInputShipInformationValidated, setIsInputShipInformationValidated] =
    useState(false);

  const [shipInformation, setShipInformation] = useState(
    shipInformationInitial
  );
  const [infoToSaveOrder, setInfoToSaveOrder] = useState({
    inputVoucher: "",
    discountVoucher: 0,
    oldAddressCode: "",
    paymentMethod: "Thanh toán khi nhận hàng",
    deliveryFee: defaultDeliveryFee,
    totalPayable: 0,
    totalProductAmount: 0,
    deliveryFeeBeforeApplyVoucher: 0,
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

  const handleGetInfoForPayment = () => {
    const conditionToGetInfoForPayment = {
      matk: localStorage.getItem("auth_matk"),
      selected: 1,
      clickPaymentFromCart: isClickedPayment,
    };
    request
      .get("/api/infoForPayment", { params: conditionToGetInfoForPayment })
      .then((res) => {
        setInfoForPayment({
          infoProduct: res.data.products,
          infoVoucher: res.data.vouchers,
          infoAdress: res.data.address,
        });
        const total = res.data.products.reduce(
          (acc, item) => (acc += item.TONGGIA),
          0
        );

        setInfoToSaveOrder({
          ...infoToSaveOrder,
          totalPayable: total + infoToSaveOrder.deliveryFee,
          totalProductAmount: total,
        });
        setIsClickedPayment(0);
      });
  };

  const handleSaveInfoForPayment = () => {
    const phoneRegex = /^0\d{9}$/;
    const {
      deliveryFee,
      discountVoucher,
      totalProductAmount,
      deliveryFeeBeforeApplyVoucher,
      paymentMethod,
      inputVoucher,
      oldAddressCode,
    } = infoToSaveOrder;

    if (shipInformation.numberPhone !== "") {
      if (!phoneRegex.test(shipInformation.numberPhone)) {
        setNumberPhoneFormatError(true);
        return;
      }
    }
    const isEmpty = Object.values(shipInformation).some(
      (value) => value === ""
    );

    if (isEmpty) {
      setIsInputShipInformationValidated(true);

      alert("Vui lòng điền đầy đủ thông tin giao hàng");
    } else {
      const getCurrentDate = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, "0");
        const day = String(today.getDate()).padStart(2, "0");
        const formattedDate = `${year}-${month}-${day}`;
        return formattedDate;
      };

      let voucherGiam = 0;
      if (
        deliveryFee === defaultDeliveryFee ||
        deliveryFee === HCMDeliveryFee
      ) {
        if (discountVoucher > 0)
          voucherGiam = totalProductAmount * discountVoucher;
        else voucherGiam = 0;
      } else voucherGiam = deliveryFeeBeforeApplyVoucher - deliveryFee;

      let totalPayable = 0;
      if (
        (deliveryFee === defaultDeliveryFee ||
          deliveryFee === HCMDeliveryFee) &&
        discountVoucher > 0
      ) {
        totalPayable =
          totalProductAmount -
          totalProductAmount * discountVoucher +
          deliveryFee;
      } else {
        totalPayable = totalProductAmount + infoToSaveOrder;
      }

      let orderStatus =
        paymentMethod === payWhenReceive ? prepareProduct : paying;

      let voucherCode = discountVoucher > 0 ? inputVoucher : "";

      const infoForOrder = {
        matk: localStorage.getItem("auth_matk"),
        ngayorder: getCurrentDate(),
        tongtien_SP: totalProductAmount,
        vouchergiam: voucherGiam,
        tongtiendonhang: totalPayable,
        deliveryFee: deliveryFee,
        hinhthucthanhtoan: paymentMethod,
        trangthaithanhtoan: uncompletePayment,
        trangthaidonhang: orderStatus,
        mavoucher: voucherCode,
        mattgh: oldAddressCode,
        ghichu: "",
      };
      const infoProductJSON = JSON.stringify(infoForPayment.infoProduct);
      const allDataForSaveInfoPayment = {
        ...shipInformation,
        // ...infoForPayment.infoProduct,
        ...infoForOrder,
        infoProductJSON,
      };
      console.log(allDataForSaveInfoPayment, "allDataForSaveInfoPayment");
      request
        .post("api/saveOrderInfo", allDataForSaveInfoPayment)
        .then((res) => {
          if (infoForOrder.hinhthucthanhtoan != "Thanh toán khi nhận hàng") {
            window.location.href = res.data.vnp_Url;
          } else if (res.data.product_quantity_error.length > 0) {
            const contentString = res.data.product_quantity_error.join("\n");

            setContentPopup({
              title: "Số lượng sản phẩm còn lại không đáp ứng đủ",
              content: contentString,
            });
            openPopup();
            setIsProductSoldOut(true);
          } else {
            if (infoForOrder.hinhthucthanhtoan != "Thanh toán khi nhận hàng")
              window.location.href = res.data.vnp_Url;

            setContentPopup({
              title: "Đơn hàng đã được tạo thành công",
              content: "Chuyển đến trang quản lý đơn hàng trong 3s",
            });
            openPopup();
            setTimeout(() => {
              window.location.href = `/myorder`;
            }, 1500);
            setTimeout(() => {
              window.location.reload();
            }, 2001);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  useEffect(() => {
    handleGetInfoForPayment();
  }, []);

  // const renderLoading = () => {
  //   return (
  //     <div class={`donut multi ${isLoading ? "" : "display_hidden"}`}></div>
  //   );
  // };

  return (
    <div>
      <div
        className={`body_box container col-lg-7 needs-validation ${
          isInputShipInformationValidated ? "was-validated" : ""
        }  `}
      >
        <DeliveryInfo
          infoForPayment={infoForPayment}
          numberPhoneFormatError={numberPhoneFormatError}
          setShipInformation={setShipInformation}
          shipInformation={shipInformation}
        />
        <ProductList infoProduct={infoForPayment.infoProduct} />
        <div>
          <PaymentInfo
            infoForPayment={infoForPayment}
            infoToSaveOrder={infoToSaveOrder}
            setInfoToSaveOrder={setInfoToSaveOrder}
          />
          <div
            class="  row justify-content-center"
            style={{ marginTop: "30px" }}
          >
            <div className="col-3">
              <button
                class={`button_confirm float-start `}
                onClick={handleSaveInfoForPayment}
              >
                {/* {renderLoading()} */}
                {/* <span class={`${isLoading ? "display_hidden" : ""}`}>
                Thanh toán
              </span> */}
                Thanh toán
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Payment;
