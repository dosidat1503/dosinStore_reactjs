import { lazy } from "react";
import config from "../config";

import UserLayout from "../components/Layouts/UserLayout";
const AccountInfo = lazy(() => import("../pages/User/AccountInfo/accountInfo"));
const Cart = lazy(() => import("../../src/pages/User/Cart/cart"));
const Payment = lazy(() => import("../../src/pages/User/Payment/payment"));
const PaymentResult = lazy(() =>
  import("../../src/pages/User/PaymentResult/paymentResult")
);
const MyOrder = lazy(() => import("../../src/pages/User/MyOrder/myorder"));
const ReviewProduct = lazy(() =>
  import("../../src/pages/User/ReviewProduct/ReviewProduct")
);

export const protectedRoutes = [
  {
    path: "/",
    element: <UserLayout />,
    children: [
      {
        path: config.routes.infoAccount,
        element: <AccountInfo />,
      },
      {
        path: config.routes.cart,
        element: <Cart />,
      },
      {
        path: config.routes.myOrder,
        element: <MyOrder />,
      },
      {
        path: config.routes.payment,
        element: <Payment />,
      },
      {
        path: config.routes.paymentResult,
        element: <PaymentResult />,
      },
      {
        path: config.routes.reviewProduct,
        element: <ReviewProduct />,
      },
    ],
  },
];
