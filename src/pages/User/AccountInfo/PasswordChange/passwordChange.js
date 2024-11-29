import style from "../BaseInfo/baseInfo.module.scss";
import clsx from "clsx";
import { useEffect, useState } from "react";
import request from "../../../../utils/request";

const PasswordChange = () => {
  const [notifySaveInfoChangePassword, setNotifySaveInfoChangePassword] =
    useState("");
  const [infoChangePassword, setInfoChangePassword] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
    matk: localStorage.getItem("auth_matk"),
  });
  const [isLoading, setIsLoading] = useState(false);
  const handleChangePassword = () => {
    setIsLoading(true);
    if (
      infoChangePassword.newPassword !== infoChangePassword.confirmNewPassword
    ) {
      setNotifySaveInfoChangePassword("Xác nhận mật khẩu mới không khớp");
      setIsLoading(false);
    } else {
      request.post("/api/changePassword", infoChangePassword).then((res) => {
        if (res.data.status === 200) {
          setNotifySaveInfoChangePassword("Lưu thành công");
          setInfoChangePassword({
            oldPassword: "",
            newPassword: "",
            confirmNewPassword: "",
            matk: localStorage.getItem("auth_matk"),
          });
          setIsLoading(false);
        } else {
          console.log(res.data.validation_errors);
          setNotifySaveInfoChangePassword(
            res.data.validation_errors.newPassword
          );
          setIsLoading(false);
        }
      });
    }
  };
  const handleInputInfoChangePassword = (e) => {
    e.persist();
    setInfoChangePassword({
      ...infoChangePassword,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      setNotifySaveInfoChangePassword("");
    }, 2000);

    return () => {
      clearTimeout(timeout);
    };
  }, [notifySaveInfoChangePassword]);

  const renderLoadingChangePassword = () => {
    return (
      <div
        className={clsx(style.donutAccountInfo, style.multiAccountInfo, {
          ["display_hidden"]: !isLoading,
        })}
      ></div>
    );
  };
  return (
    <div className="col-5">
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          fontWeight: "bold",
        }}
      >
        <span className={style.nameRow}>THAY ĐỔI MẬT KHẨU</span>
      </div>
      <div className={clsx(style.nameRow, "row")}>
        <p className="text-end col-4">Mật khẩu cũ</p>
        <input
          className={clsx("col-7", style.roundCornerInput)}
          type="text"
          width="180"
          name="oldPassword"
          onChange={handleInputInfoChangePassword}
          value={infoChangePassword.oldPassword}
        />
      </div>
      <div className={clsx(style.nameRow, "row")}>
        <p className="text-end col-4">Mật khẩu mới</p>
        <input
          className={clsx("col-7", style.roundCornerInput)}
          type="password"
          width="250"
          name="newPassword"
          onChange={handleInputInfoChangePassword}
          value={infoChangePassword.newPassword}
        />
      </div>
      <div className={clsx(style.nameRow, "row")}>
        <p className="text-end col-4">Xác nhận mật khẩu</p>
        <input
          className={clsx("col-7", style.roundCornerInput)}
          type="password"
          width="250"
          name="confirmNewPassword"
          onChange={handleInputInfoChangePassword}
          value={infoChangePassword.confirmNewPassword}
        />
      </div>
      <div className={style.dCenter}>
        <span className={style.successSave}>
          {notifySaveInfoChangePassword}
        </span>
      </div>
      <div className={style.dCenter}>
        <input
          onClick={handleChangePassword}
          className={clsx(style.passwordChangeButton, {
            ["display_hidden"]: isLoading,
          })}
          type="button"
          value="Đổi mật khẩu"
        />
        {renderLoadingChangePassword()}
      </div>
    </div>
  );
};

export default PasswordChange;
