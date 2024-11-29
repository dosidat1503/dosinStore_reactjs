import { NavLink } from "react-router-dom";
import style from "./headerNavigation.module.scss";

import config from "../../../../config";

function MenuItem({ title, to, icon }) {
  return (
    <div className={style.textContainer}>
      <NavLink to={config.routes.collection + to} className={style.text}>
        {icon}
        {title}
      </NavLink>
    </div>
  );
}

export default MenuItem;
