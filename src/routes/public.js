import { lazy } from "react";
import config from "../config";

import UserLayout from "../components/Layouts/UserLayout";
const UserLogin = lazy(() => import("../../src/pages/User/Login"));
const Home = lazy(() => import("../../src/pages/User/Home"));
const Collection = lazy(() =>
  import("../../src/pages/User/Collection/collection")
);
const InfoProduct = lazy(() =>
  import("../../src/pages/User/InfoProduct/infoProduct")
);
const Cart = lazy(() => import("../../src/pages/User/Cart/cart"));

export const publicRoutes = [
  {
    path: "/",
    element: <UserLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: config.routes.collection,
        element: <Collection />,
      },
      {
        path: config.routes.infoProduct,
        element: <InfoProduct />,
      },
      {
        path: config.routes.cart,
        element: <Cart />,
      },
    ],
  },
  {
    path: config.routes.login,
    element: <UserLogin />,
  },
];
