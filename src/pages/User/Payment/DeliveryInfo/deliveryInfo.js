import style from "./deliveryInfo.module.scss";

import clsx from "clsx";
import axios from "axios";
import { faCaretDown, faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useEffect } from "react";

import {
  shipInformationInitial,
  HCMDeliveryFee,
  defaultDeliveryFee,
} from "../payment";
import {
  CommuneList,
  DistrictList,
  ProvinceList,
} from "../AddressSelect/addressSelect";

const HCMCity = "Thành phố Hồ Chí Minh";
const URL_APIAdsress = "https://esgoo.net/api-tinhthanh/";

const DeliveryInfo = (props) => {
  const {
    infoForPayment,
    numberPhoneFormatError,
    setShipInformation,
    shipInformation,
  } = props;

  const [isOpenAddessList, setIsOpenAddessList] = useState(false);
  const [dataAPIAddress, setDataAPIAddress] = useState({
    province: [],
    districts: [],
    commune: [],
  });

  const handleGetProvince = () => {
    axios.get(`${URL_APIAdsress}/1/0.htm`).then((res) => {
      setDataAPIAddress({
        ...dataAPIAddress,
        province: res.data.data.filter((item) => item),
      });

      setShipInformation({
        ...shipInformation,
        city: res.data.data[0].name,
      });
    });
  };

  const handleGetDistrict = async (ID_Province) => {
    axios.get(`${URL_APIAdsress}/2/${ID_Province}.htm`).then((res) => {
      setDataAPIAddress({
        ...dataAPIAddress,
        districts: res.data.data.filter((item) => item),
      });

      let districtName = "";
      if (shipInformation.district === "") districtName = res.data.data[0].name;
      else districtName = shipInformation.district;

      setShipInformation({
        ...shipInformation,
        district: districtName,
      });
    });
  };

  const handleGetCommune = (ID_District) => {
    axios.get(`${URL_APIAdsress}/3/${ID_District}.htm`).then((res) => {
      setDataAPIAddress({
        ...dataAPIAddress,
        commune: res.data.data.filter((item) => item),
      });
      let name = "";
      if (shipInformation.ward === "") name = res.data.data[0].name;
      else name = shipInformation.ward;

      setShipInformation({
        ...shipInformation,
        ward: name,
      });
    });
  };

  const handleInputShipInformation = (e) => {
    const propertyName = e.target.name;
    const propertyValue = e.target.value;

    let totalPayable = 0;
    let deliveryFee = 0;
    if (propertyValue === HCMCity) {
      totalPayable = shipInformation.totalProductAmount + HCMDeliveryFee;
      deliveryFee = HCMDeliveryFee;
    } else {
      totalPayable = shipInformation.totalProductAmount + defaultDeliveryFee;
      deliveryFee = defaultDeliveryFee;
    }

    setShipInformation({
      ...shipInformation,
      [propertyName]: propertyValue,
      totalPayable: totalPayable,
      deliveryFee: deliveryFee,
    });
  };

  const handleChooseAdress = (index) => {
    const { MATTGH, TEN, SDT, DIACHI, TINH_TP, QUAN_HUYEN, PHUONG_XA } =
      infoForPayment.infoAdress[index];
    console.log(MATTGH, "MATTGH");
    setShipInformation({
      ...shipInformation,
      name: TEN,
      numberPhone: SDT,
      address: DIACHI,
      city: TINH_TP,
      district: QUAN_HUYEN,
      ward: PHUONG_XA,
      oldAddressCode: MATTGH,
    });
    setIsOpenAddessList(false);
  };

  const handleClickAddNewAddress = () => {
    setShipInformation({
      ...shipInformation,
      ...shipInformationInitial,
      oldAddressCode: "",
    });
    setIsOpenAddessList(false);
  };

  useEffect(() => {
    handleGetProvince();
  }, []);

  useEffect(() => {
    const found = dataAPIAddress.province.find(
      (item) => item.name === shipInformation.city
    );
    found && handleGetDistrict(found.id);
  }, [shipInformation.city]);

  useEffect(() => {
    const found = dataAPIAddress.districts.find(
      (item) => item.name === shipInformation.district
    );
    found && handleGetCommune(found.id);
  }, [shipInformation.district]);

  const renderInfoAddressShip = infoForPayment.infoAdress.map((item, index) => {
    return (
      <div className={style.previousAddressContainer} key={index}>
        <div className="row text-start align-items-center">
          <div className="col-auto text-center">
            <input
              type="radio"
              name="address_radio"
              data-bs-toggle="collapse"
              href="#address_change"
              onClick={() => handleChooseAdress(index)}
            />
          </div>
          <div className={clsx(style.addressInfoText, "col-2")} id="itemmm">
            <span>{item.TEN}</span>
          </div>
          <div className={clsx(style.addressInfoText, "col-2")}>
            <span>{item.SDT}</span>
          </div>
          <div className={clsx(style.addressInfoText, "col")}>
            <span>
              {item.DIACHI}, {item.PHUONG_XA}, {item.QUAN_HUYEN}, {item.TINH_TP}
            </span>
          </div>
        </div>
      </div>
    );
  });

  return (
    <>
      <div className={style.previousAddressContainer}>
        <div className={clsx(style.addressTitle, "row")}>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <FontAwesomeIcon
              className={style.faLocationDot}
              icon={faLocationDot}
            ></FontAwesomeIcon>
            <span>Thông tin giao hàng đã đặt hàng những lần trước</span>
            <div
              onClick={() => {
                setIsOpenAddessList(!isOpenAddessList);
              }}
              style={{ cursor: "pointer", marginLeft: "10px" }}
            >
              <FontAwesomeIcon icon={faCaretDown}></FontAwesomeIcon>
            </div>
          </div>
        </div>
      </div>
      {isOpenAddessList && (
        <div>
          <div className={style.previousAddressContainer}>
            <div className="row text-center">
              <div className="col-auto">
                <span>&nbsp;</span>
              </div>
              <div className={clsx("col-2", style.tableHeaderContainer)}>
                <span>Tên người nhận</span>
              </div>
              <div className={clsx("col-2", style.tableHeaderContainer)}>
                <span>SĐT</span>
              </div>
              <div className={clsx("col", style.tableHeaderContainer)}>
                <span>Địa chỉ</span>
              </div>
            </div>
          </div>
          {renderInfoAddressShip}
          <button
            type="button"
            className={clsx("link-dark", style.addNewAddress)}
            data-bs-toggle="collapse"
            href="#address_change"
            onClick={handleClickAddNewAddress}
          >
            + Thêm địa chỉ mới
          </button>
        </div>
      )}
      <div className="address_update" id="address_update">
        <div className="row mb-2">
          <div className="col-6">
            <label for="#" className="form-label">
              Tên người nhận hàng
            </label>
            <input
              type="text"
              className="form-control "
              value={shipInformation.name}
              onChange={handleInputShipInformation}
              name="name"
              required
            />
          </div>
          <div className="col-6">
            <label for="#" className="form-label">
              SDT người nhận hàng
            </label>
            <input
              type="text"
              className="form-control"
              value={shipInformation.numberPhone}
              onChange={handleInputShipInformation}
              name="numberPhone"
              required
            />
          </div>
        </div>
        <div className="row mb-2">
          <span
            className={clsx(style.formatError, {
              ["display_hidden"]: !numberPhoneFormatError,
            })}
          >
            Sai định dạng SĐT
          </span>
        </div>
        <div className="row mb-3">
          <div className="col-4">
            <label for="#" className="form-label">
              Tỉnh/Thành phố
            </label>
            <select
              className={clsx("form-select", style.selectContainer)}
              required
              value={shipInformation.city}
              onChange={handleInputShipInformation}
              name="city"
            >
              <option selected value="">
                -- Chọn tỉnh/thành phố --
              </option>
              <ProvinceList dataAPIAddress={dataAPIAddress} />
            </select>
          </div>
          <div className="col-4">
            <label for="#" className="form-label">
              Quận/Huyện
            </label>
            <select
              className={clsx("form-select", style.selectContainer)}
              required
              value={shipInformation.district}
              onChange={handleInputShipInformation}
              name="district"
            >
              <option selected value="">
                -- Chọn quận/huyện --
              </option>
              <DistrictList dataAPIAddress={dataAPIAddress} />
            </select>
          </div>
          <div className="col-4">
            <label for="#" className="form-label">
              Phường/Xã
            </label>
            <select
              className={clsx("form-select", style.selectContainer)}
              required
              value={shipInformation.ward}
              onChange={handleInputShipInformation}
              name="ward"
            >
              <option selected value="">
                -- Chọn phường/xã --
              </option>
              <CommuneList dataAPIAddress={dataAPIAddress} />
            </select>
          </div>
        </div>
        <div className="row mb-2">
          <div className="col-12">
            <label for="#" className="form-label">
              Địa chỉ chi tiết
            </label>
            <input
              type="text"
              className="form-control"
              value={shipInformation.address}
              onChange={handleInputShipInformation}
              name="address"
              required
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default DeliveryInfo;
