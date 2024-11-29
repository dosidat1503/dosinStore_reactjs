import "./infoProduct.css";
import "bootstrap";

import { useEffect, useRef, useState } from "react";
import React from "react";
import request from "../../../utils/request";

import ImageSlider from "./ImageSlider";
import useGlobalVariableContext from "../../../context_global_variable/context_global_variable";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Introduce from "./Introduce/introduce";
import Review from "./Review/review";
import BaseInfo from "./BaseInfo/baseInfo";
import TypeChose from "./TypeChose/typeChose";
import AddToCard from "./AddToCard/addToCard";
import RelativeProduct from "./RelativeProduct/relativeProduct";

function InfoProduct() {
  const [relativeProduct, setRelativeProduct] = useState([]);
  useEffect(() => {
    document.title = "DosiIn | Thông tin sản phẩm";
  }, []);
  const urlParams = new URLSearchParams(window.location.search);
  const [id, setId] = useState(urlParams.get("id")); // Khởi tạo id ban đầu là null

  useEffect(() => {
    setId(urlParams.get("id"));
  }, [window.location.search]);

  const handleClickOutPopUpCart = (event) => {
    if (!buttonAddToCartRef.current?.contains(event.target)) {
      setStatusPressAddToCart(false);
    }
  };

  const handleScroll = () => {
    const scrollPosition = window.scrollY;

    if (scrollPosition > 100) {
      setStatusPressAddToCart(false);
    }
  };

  useEffect(() => {
    getInfo();
    getProductReviews();

    window.addEventListener("scroll", handleScroll);
    document.addEventListener("click", handleClickOutPopUpCart);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("click", handleClickOutPopUpCart);
    };
  }, [id]);

  const { setStatusPressAddToCart, listSizeToCheck } =
    useGlobalVariableContext();
  const textareaRef = useRef(null);
  const buttonAddToCartRef = useRef(null);
  const [hetHang, setHetHang] = useState(false);
  const [productReviews, setProductReviews] = useState([]);
  const [selectPropertyProduct, setSelectPropertyProduct] = useState({
    mamau: 0,
    masize: "",
    soluong: 1,
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isLoading) {
      console.log("isLoading", typeof id);
      request
        .get("/api/getRelativeProduct", { params: { masp: id } })
        .then((res) => {
          console.log(res.data.data_relativeProduct, "data_relativeProduct");
          setRelativeProduct(res.data.data_relativeProduct);
        });
    }
  }, [isLoading]);
  const [infoProduct, setInfoProduct] = useState({
    data_sanpham: {},
    data_mausac: [],
    data_mamau: [],
    data_size: [],
    data_xacDinhSoLuong: [],
    imgURL: [],
  });

  const getInfo = () => {
    setIsLoading(true);
    request
      .get(`/api/productDetail?id=${id}`)
      .then((res) => {
        setIsLoading(false);
        console.log(res.data, "data_size");
        let arrToSort = res.data.data_size;

        arrToSort.sort((a, b) => {
          const indexA = listSizeToCheck.indexOf(a.MASIZE);
          const indexB = listSizeToCheck.indexOf(b.MASIZE);

          return indexA - indexB;
        });
        setInfoProduct({
          data_sanpham: res.data.data_sanpham,
          data_mausac: res.data.data_mausac,
          data_mamau: res.data.data_mamau,
          data_size: res.data.data_size,
          data_xacDinhSoLuong: res.data.data_xacDinhSoLuong,
          imgURL: res.data.data_hinhanh,
        });
        window.scrollTo(0, 0); // Cuộn lên đầu trang khi component được mount
      })
      .catch((e) => {
        setIsLoading(false);
        console.log(e);
      });
  };
  const [showStarQuantity, setShowStarQuantity] = useState({
    solidStar: 0,
    regularStar: 5,
  });

  const getProductReviews = () => {
    const masp = parseInt(id);
    request.get(`/api/getProductReviews?masp=${masp}`).then((res) => {
      let totalStar = 0;
      const reviewQuantity = res.data.productReviews.length;

      res.data.productReviews.map((item) => {
        totalStar += item.SOLUONG_SAO;
      });
      if (reviewQuantity > 0) {
        setShowStarQuantity({
          solidStar: Math.ceil(totalStar / reviewQuantity),
          regularStar: 5 - Math.ceil(totalStar / reviewQuantity),
        });
      } else {
        setShowStarQuantity({
          solidStar: 0,
          regularStar: 5,
        });
      }
      setProductReviews(res.data.productReviews);
    });
  };

  useEffect(() => {
    if (
      textareaRef.current &&
      infoProduct &&
      infoProduct.data_sanpham &&
      infoProduct.data_sanpham.MOTA
    ) {
      const textarea = textareaRef.current;
      const content = infoProduct.data_sanpham.MOTA;

      textarea.value = content;

      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [infoProduct]);

  useEffect(() => {
    getInfo();
    getProductReviews();
  }, []);

  const renderLoading = () => {
    return (
      <div class={`donut multi ${isLoading ? "" : "display_hidden"}`}></div>
    );
  };

  return (
    <div class={`container col-sm-12 ${isLoading === true ? "" : ""}`}>
      <div
        class={`loadingInfoProductTrue ${
          isLoading === false ? "display_hidden" : ""
        }`}
      >
        {renderLoading()}
      </div>
      <div
        class={`container-fluid ${isLoading === true ? "display_hidden" : ""}`}
      >
        <div class="container_info_product">
          <div class="col-sm-7">
            <ImageSlider
              slides={infoProduct.imgURL.length > 0 && infoProduct.imgURL}
            />
            <Review productReviews={productReviews} />
          </div>
          <div class="col-sm-5 detail_info_product">
            <BaseInfo
              baseInfo={infoProduct.data_sanpham}
              showStarQuantity={showStarQuantity}
            />
            <TypeChose
              setSelectPropertyProduct={setSelectPropertyProduct}
              selectPropertyProduct={selectPropertyProduct}
              infoProduct={infoProduct}
              setHetHang={setHetHang}
            />
            <AddToCard
              infoProduct={infoProduct}
              selectPropertyProduct={selectPropertyProduct}
              buttonAddToCartRef={buttonAddToCartRef}
              hetHang={hetHang}
              setHetHang={setHetHang}
              id={id}
            />
            <Introduce
              content={infoProduct.data_sanpham.MOTA}
              textareaRef={textareaRef}
            />
          </div>
        </div>
        <RelativeProduct relativeProduct={relativeProduct} />
      </div>
    </div>
  );
}

export default InfoProduct;
