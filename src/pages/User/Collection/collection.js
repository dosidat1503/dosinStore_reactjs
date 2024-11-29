import "bootstrap/dist/css/bootstrap.css";
import request from "../../../utils/request";
import { useEffect, useState } from "react";
import useGlobalVariableContext from "../../../context_global_variable/context_global_variable";
import { useLocation } from "react-router-dom";
import { NEW } from "../Home";

import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import Filter from "./Filter/filter";
import ProductCard from "../Home/ProductCard/productCard";
import style from "./collection.module.scss";
import clsx from "clsx";

const { title, foundProduct, products } = style;

const sortTypeList = [
  {
    id: "moinhat",
    name: "Mới nhất",
  },
  {
    id: "banchay",
    name: "Bán chạy",
  },
  {
    id: "thapDenCao",
    name: "Thấp đến cao",
  },
  {
    id: "caoDenThap",
    name: "Cao xuống thấp",
  },
];

const fashionTypeList = [
  {
    id: 1,
    title: "NAM",
  },
  {
    id: 2,
    title: "NỮ",
  },
  {
    id: 3,
    title: "TRẺ EM",
  },
];
const numberProductEachPage = 20;

function Collection() {
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);

  const [paginationNumberRunFirst, setPaginationNumberRunFirst] = useState(0);
  const [query, setQuery] = useState(searchParams.get("query"));
  const [fashionType, setFashionType] = useState(
    parseInt(searchParams.get("fashionType") || 1)
  );
  const [category, setCategory] = useState(
    parseInt(searchParams.get("category") || 1)
  );
  const [sortBy, setSortBy] = useState(
    searchParams.get("sortBy") || sortTypeList[0].id
  );

  const [collections, setCollections] = useState({
    collection: {
      nameState: parseInt(fashionType),
      productList: [],
      pageQuantity: null,
      paginationList: [],
      openingPage: 1,
      hasLoadFirtTime: 0,
      hasChangeFromPreState: 0,
      itemQuantity: 0,
      spaceGetDataFromProductList: [
        {
          paginationNumber: 1,
          ordinalNumber: 1,
          startIndex: 0,
          endIndex: numberProductEachPage,
        },
      ],
    },
  });
  const collectionArray = Object.entries(collections).map(([key, value]) => ({
    key: key,
    value: value,
  }));

  const handleFilter = (categoryType, sortType) => {
    setCollections({
      collection: {
        nameState: parseInt(fashionType),
        productList: [],
        pageQuantity: null,
        paginationList: [],
        openingPage: 1,
        hasLoadFirtTime: 0,
        hasChangeFromPreState: 0,
        itemQuantity: 0,
        spaceGetDataFromProductList: [
          {
            paginationNumber: 1,
            ordinalNumber: 1,
            startIndex: 0,
            endIndex: numberProductEachPage,
          },
        ],
      },
    });
    setSortBy(sortType);
    setCategory(categoryType);
    setPaginationNumberRunFirst(0);
  };

  const getProductCollection = (openingPage, category, sortBy) => {
    const collectionItemKey = collectionArray[0].key;

    const queryForGetInfoCollection = {
      start: numberProductEachPage * (openingPage - 1),
      numberProductEachPage: numberProductEachPage,
      fashionType: parseInt(fashionType),
      category: parseInt(category) || 1,
      sortBy: sortBy,
      query_data: query,
    };

    try {
      request
        .get(`/api/getProductCollection`, { params: queryForGetInfoCollection })
        .then((res) => {
          console.log(res, "okokasjc");
          setCollections((prevProduct) => {
            const itemIndex = prevProduct[
              collectionItemKey
            ].spaceGetDataFromProductList.findIndex(
              (item) => item.paginationNumber === openingPage
            );
            let arrAddToPaginationList = [];
            let SL_MASP = 0;
            res.data.quantity.forEach((itemStatusFromDB) => {
              const pageQuantityShow = Math.ceil(
                itemStatusFromDB.SL_MASP / numberProductEachPage
              );

              for (let i = 1; i <= pageQuantityShow; i++)
                arrAddToPaginationList.push(i);
              SL_MASP = itemStatusFromDB.SL_MASP;
            });

            if (
              itemIndex === -1 ||
              (openingPage === 1 && paginationNumberRunFirst === 0)
            ) {
              setPaginationNumberRunFirst(1);

              return {
                ...prevProduct,
                [collectionItemKey]: {
                  ...prevProduct[collectionItemKey],
                  productList: [
                    ...prevProduct[collectionItemKey].productList.filter(
                      (item) => item
                    ),
                    ...res.data.productList.filter((item) => item),
                  ],
                  pageQuantity: SL_MASP,
                  paginationList: arrAddToPaginationList,
                  spaceGetDataFromProductList: [
                    ...collections[collectionItemKey]
                      .spaceGetDataFromProductList,
                    {
                      paginationNumber: openingPage,
                      ordinalNumber:
                        collections[collectionItemKey]
                          .spaceGetDataFromProductList.length + 1,
                      startIndex:
                        collections[collectionItemKey].productList.length,
                      endIndex:
                        res.data.productList.length +
                        collections[collectionItemKey].productList.length,
                    },
                  ],
                },
              };
            } else {
              return {
                ...prevProduct,
              };
            }
          });
        });
    } catch (err) {
      console.log(err);
    }
  };

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "instant" });
  };
  const handlePageChange = (event, page) => {
    handleClickItemPagination(page);
  };
  const handleClickItemPagination = (openingPage) => {
    const collectionItemKey = collectionArray[0].key;
    const updateOpeningPage = (prevProduct) => ({
      ...prevProduct,
      [collectionItemKey]: {
        ...prevProduct[collectionItemKey],
        openingPage: openingPage,
      },
    });
    setCollections(updateOpeningPage);
    getProductCollection(openingPage, category, sortBy);
    handleScrollToTop();
  };

  useEffect(() => {
    getProductCollection(1, 1, sortBy);
  }, []);

  useEffect(() => {
    const newSortBy = searchParams.get("sortBy");
    const newCategory = parseInt(searchParams.get("category"));
    const newFashionType = parseInt(searchParams.get("fashionType"));
    if (newSortBy !== sortBy && newSortBy !== null) {
      handleFilter(category, newSortBy);
    }
    if (newCategory !== category && newCategory !== null) {
      handleFilter(newCategory, sortBy);
    }
    if (newFashionType !== fashionType) {
      if (paginationNumberRunFirst === 0) {
        collectionArray.map((item) =>
          getProductCollection(1, category, sortBy)
        );
      }
      let queryParam = searchParams.get("query");
      if (newFashionType !== null) {
        setFashionType(newFashionType);
        handleFilter(1, "moinhat");
        setQuery(null);
      } else {
        setQuery(queryParam);
        handleFilter(1, sortBy);
        getProductCollection(1, category, sortBy);
      }
      switch (fashionType) {
        case 1:
          document.title = "DosiIn | Nam";
          break;
        case 2:
          document.title = "DosiIn | Nữ";
          break;
        case 3:
          document.title = "DosiIn | Trẻ em";
          break;
        default:
          document.title = "DosiIn | Tìm kiếm sản phẩm";
          break;
      }
    }
  }, [location.search]);

  useEffect(() => {
    if (paginationNumberRunFirst === 0) {
      collectionArray.map((item) => getProductCollection(1, category, sortBy));
    }
  }, [paginationNumberRunFirst === 0]);

  const renderProduct = () => {
    let index = {
      start: 0,
      end: 0,
    };
    collectionArray[0].value.spaceGetDataFromProductList.filter((item) => {
      if (item.paginationNumber === collectionArray[0].value.openingPage) {
        index.start = item.startIndex;
        index.end = item.endIndex;
      }
    });

    return (
      <ProductCard
        products={collections.collection.productList.slice(
          index.start,
          index.end
        )}
        type={NEW}
      />
    );
  };

  const renderTitle = () => {
    return fashionTypeList.map((item, index) => {
      return (
        <h1
          key={index}
          className={`${
            query === null && fashionType === item.id ? "" : "display_hidden"
          }`}
        >
          THỜI TRANG {item.title}
        </h1>
      );
    });
  };

  return (
    <div className="container">
      <div className={title}>
        <h1 className={`${query !== null ? "" : "display_hidden"}`}>
          SẢN PHẨM TÌM THẤY
        </h1>
        {renderTitle()}
      </div>
      <Filter
        sortBy={sortBy}
        category={category}
        query={query}
        notHaveProduct={collectionArray[0].value.pageQuantity === 0}
        fashionType={fashionType}
      ></Filter>
      <div className={clsx(foundProduct, "row")}>
        <span className={`${query !== null ? "" : "display_hidden"}`}>
          Tìm thấy {collectionArray[0].value.pageQuantity} sản phẩm
        </span>
        <span className={`${query === null ? "" : "display_hidden"}`}>
          Có {collectionArray[0].value.pageQuantity} sản phẩm
        </span>
      </div>
      <div className={products}>{renderProduct()}</div>
      <div className={`pagination-container`}>
        <Stack spacing={2}>
          <Pagination
            page={collectionArray[0].value.openingPage} // Sử dụng openingPage từ state
            count={collectionArray[0].value.paginationList.length}
            onChange={(event, page) => handlePageChange(event, page)}
            color="primary"
          />
        </Stack>
      </div>
    </div>
  );
}

export default Collection;
