import style from "./headerCard.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
const {
  tableHeaderRow,
  headerColumn0,
  headerColumn1,
  headerColumn2,
  headerColumn3,
  headerColumn4,
  headerColumn5,
  btnDeleteCart,
} = style;

const HeaderCard = ({
  isCheckedAll,
  itemCarts,
  setIsCheckedAll,
  setTongTienAllItem,
}) => {
  const handleClickCheckboxAll = () => {
    itemCarts.forEach((item) => {
      !isCheckedAll ? (item.SELECTED = 1) : (item.SELECTED = 0);
    });
    setIsCheckedAll(!isCheckedAll);

    let tinhtongtien = 0;
    itemCarts.map((item) =>
      item.SELECTED === 1
        ? (tinhtongtien = tinhtongtien + item.TONGGIA)
        : tinhtongtien
    );
    setTongTienAllItem(tinhtongtien);
  };
  return (
    <thead class="table-header">
      <tr className={tableHeaderRow}>
        <th className={headerColumn0}>
          <input
            type="checkbox"
            name="checkboxProductInCart"
            checked={isCheckedAll}
            onChange={handleClickCheckboxAll}
          />
        </th>
        <th className={headerColumn1}>Sản phẩm</th>
        <th className={headerColumn2}>Giá</th>
        <th className={headerColumn3}>Số lượng</th>
        <th className={headerColumn4}>Thành tiền</th>
        <th className={headerColumn5}>
          <button className={btnDeleteCart}>
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </th>
      </tr>
    </thead>
  );
};

export default HeaderCard;
