import { useEffect, useState } from "react";
import "./accountInfo.css";
import "bootstrap";
import BaseInfo from "./BaseInfo/baseInfo";
import PasswordChange from "./PasswordChange/passwordChange";

function InfoAccount() {
  useEffect(() => {
    document.title = "DosiIn | Thông tin tài khoản";
  }, []);

  return (
    <div>
      <div class="order_info_body container">
        <div class="heading text-uppercase text-center thongtintaikhoan">
          <h1>Thông tin tài khoản</h1>
        </div>
        <div class="form_container row">
          <BaseInfo />
          <PasswordChange />
        </div>
      </div>
    </div>
  );
}

export default InfoAccount;
