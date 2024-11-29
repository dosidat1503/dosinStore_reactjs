import style from "./headerNavigation.module.scss";

function Menu({ children }) {
  return <nav className={style.headerNavigation}>{children}</nav>;
}

export default Menu;
