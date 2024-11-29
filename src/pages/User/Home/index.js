import style from "./index.module.scss";
import "bootstrap/dist/css/bootstrap.css";
import ProductCard from "./ProductCard/productCard";

import * as request from "../../../utils/request";
import { useEffect, useState } from "react";

import Banner from "./Banner/banner";
export const NEW = "new";
const HOT = "hot";

const { productContainer, title, productList } = style;

function Home() {
  useEffect(() => {
    document.title = "DosiIn | Trang chủ";
  }, []);
  const [productsInNewProduct, setProductsInNewProduct] = useState([]);
  const [hotProduct, setHotProduct] = useState([]);

  const getProductAtHome = () => {
    request
      .get("/api/getProductAtHome")
      .then((res) => {
        console.log(res.dataNewProduct, "res.dataNewProduct");
        setProductsInNewProduct(res.dataNewProduct);
        setHotProduct(res.dataHotProduct);
      })
      .catch((res) => {
        console.log(res.data);
      });
  };
  useEffect(() => {
    getProductAtHome();
  }, []);

  return (
    <div className="container left">
      <Banner />
      <div className={productContainer}>
        <h1 className={title}>SẢN PHẨM MỚI</h1>
        <div className={productList}>
          <ProductCard products={productsInNewProduct} type={NEW} />
        </div>
      </div>
      <div className={productContainer}>
        <h1 className={title}>SẢN PHẨM HOT</h1>
        <div className={productList}>
          <ProductCard products={hotProduct} type={HOT} />
        </div>
      </div>
    </div>
  );
}

export default Home;
