import clsx from "clsx";
import style from "./baseInfo.module.scss";
import { useEffect, useState } from "react";
import request from "../../../../utils/request";

const BaseInfo = () => {
  const [infoAccount, setInfoAccount] = useState({
    name: "",
    email: "",
    gender: "",
    numberPhone: "",
    address: "",
  });
  const [notifySaveInfoAccount, setNotifySaveInfoAccount] = useState("");
  const [numberPhoneFormatError, setNumberPhoneFormatError] = useState(false);
  const [isLoadingChangeSave, setIsLoadingChangeSave] = useState(false);

  const handleInputInfoAccount = (e) => {
    e.persist();
    setInfoAccount({ ...infoAccount, [e.target.name]: e.target.value });
  };
  const handleInputNumberPhone = (e) => {
    e.persist();
    e.target.value = e.target.value.replace(/[^0-9]/g, "");
    setInfoAccount({ ...infoAccount, [e.target.name]: e.target.value });
  };
  const handleSaveBaseInfo = () => {
    const data = {
      name: infoAccount.name,
      email: infoAccount.email,
      gender: infoAccount.gender,
      numberPhone: infoAccount.numberPhone,
      address: infoAccount.address,
      matk: localStorage.getItem("auth_matk"),
    };
    setIsLoadingChangeSave(true);
    const phoneRegex = /^0\d{9}$/; // Biểu thức chính quy để kiểm tra định dạng số điện thoại

    if (infoAccount.numberPhone !== "") {
      if (!phoneRegex.test(infoAccount.numberPhone)) {
        setNumberPhoneFormatError(true);
        setIsLoadingChangeSave(false);
        return; // Không gửi request nếu số điện thoại không đúng định dạng
      }
    }

    request.post("/api/saveInfoAccount", data).then((res) => {
      setIsLoadingChangeSave(false);
      setNumberPhoneFormatError(false);
      setNotifySaveInfoAccount("Lưu thành công");
    });
  };

  const getInfoAccount = () => {
    request
      .get("/api/getInfoAccount", {
        params: { matk: localStorage.getItem("auth_matk") },
      })
      .then((res) => {
        setInfoAccount({
          name: res.data.infoAccount.TEN,
          email: res.data.infoAccount.EMAIL,
          gender: res.data.infoAccount.gioitinh,
          numberPhone: res.data.infoAccount.SDT,
          address: res.data.infoAccount.DIACHI,
        });
      });
  };

  useEffect(() => {
    getInfoAccount();
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setNotifySaveInfoAccount("");
    }, 2000);

    return () => {
      clearTimeout(timeout);
    };
  }, [notifySaveInfoAccount]);

  const renderLoadingChangeSave = () => {
    return (
      <div
        className={clsx(style.donutAccountInfo, style.multiAccountInfo, {
          ["display_hidden"]: !isLoadingChangeSave,
        })}
      ></div>
    );
  };
  return (
    <div className="container col-6">
      <div className={clsx("row", style.nameRow)}>
        <p className="text-end col-3">Họ và Tên</p>
        <input
          className={clsx("col-7", style.roundCornerInput)}
          type="text"
          width="250"
          name="name"
          onChange={handleInputInfoAccount}
          value={infoAccount.name}
        />
      </div>
      <div className={clsx("row", style.nameRow)}>
        <p className="text-end col-3">Giới tính</p>
        <div className="text-start col-7">
          <div className="form-check form-check-inline">
            <input
              className="form-check-input"
              type="radio"
              name="gender"
              id="inlineRadio1"
              value="Nam"
              checked={infoAccount.gender === "Nam"}
              onChange={handleInputInfoAccount}
            />
            <label className="form-check-label" for="inlineRadio1">
              Nam
            </label>
          </div>
          <div className="form-check form-check-inline">
            <input
              className="form-check-input"
              type="radio"
              name="gender"
              id="inlineRadio2"
              value="Nữ"
              checked={infoAccount.gender === "Nữ"}
              onChange={handleInputInfoAccount}
            />
            <label className="form-check-label" for="inlineRadio2">
              Nữ
            </label>
          </div>
        </div>
      </div>
      <div className={clsx("row", style.nameRow)}>
        <p className="text-end col-3">Email</p>
        <input
          className={clsx("col-7", style.roundCornerInput)}
          type="text"
          width="250"
          name="email"
          onChange={handleInputInfoAccount}
          value={infoAccount.email}
          disabled
        />
      </div>
      <div className={clsx("row", style.nameRow)}>
        <p className="text-end col-3">SĐT</p>
        <input
          className={clsx("col-7", style.roundCornerInput)}
          type="text"
          width="250"
          name="numberPhone"
          onChange={handleInputNumberPhone}
          value={infoAccount.numberPhone}
        />
      </div>
      <span
        className={clsx(style.formatError, {
          ["display_hidden"]: !numberPhoneFormatError,
        })}
      >
        Sai định dạng SĐT
      </span>
      <div className={clsx(style.nameRow, "address", "row")}>
        <p className="text-end col-3">Địa chỉ</p>
        <input
          className={clsx("col-7", style.roundCornerInput)}
          type="text"
          name="address"
          onChange={handleInputInfoAccount}
          value={infoAccount.address}
        />
      </div>
      <div className={clsx(style.nameRow, "row", style.dCenter)}>
        <input
          onClick={handleSaveBaseInfo}
          className={clsx(style.lastButton, {
            ["display_hidden"]: isLoadingChangeSave,
          })}
          type="button"
          value="Lưu thay đổi"
        />
        {renderLoadingChangeSave()}
        <div className={style.dCenter}>
          <span
            className={clsx(style.notifySaveInfoAccount, style.successSave)}
          >
            {notifySaveInfoAccount}
          </span>
        </div>
      </div>
    </div>
  );
};

export default BaseInfo;
