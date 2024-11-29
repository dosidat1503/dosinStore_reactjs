import style from "./headerNavigation.module.scss";

import MenuItem from "./MenuItem";
import Menu from "./Menu";

export const MenuList = [
  {
    title: "Nam",
    to: "?fashionType=1",
  },
  {
    title: "Nữ",
    to: "?fashionType=2",
  },
  {
    title: "Trẻ em",
    to: "?fashionType=3",
  },
];

function Navigation() {
  const renderMenuList = () => {
    return MenuList.map((item, index) => {
      return <MenuItem key={index} title={item.title} to={item.to} />;
    });
  };
  return (
    <div>
      <Menu>{renderMenuList()}</Menu>
    </div>
  );
}

export default Navigation;
