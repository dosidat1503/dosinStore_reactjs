import style from "./bodyCard.module.scss";
import request from "../../../../utils/request";
import useGlobalVariableContext from "../../../../context_global_variable/context_global_variable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

const {
  row1,
  boxRow1Column1,
  row1Column1Item,
  imgRow1,
  boxRow1,
  inputNumber,
  btnDeleteCart,
  row1Item,
} = style;
const BodyCard = ({
  setItemCart,
  setIsCheckedAll,
  setTongTienAllItem,
  itemCarts,
}) => {
  const { formatPrice } = useGlobalVariableContext();
  const handleClickCheckbox = (index) => {
    const listItemCarts = [...itemCarts];
    listItemCarts[index].SELECTED === 0
      ? (listItemCarts[index].SELECTED = 1)
      : (listItemCarts[index].SELECTED = 0);
    setItemCart(listItemCarts);
    setIsCheckedAll(listItemCarts.every((itemCarts) => itemCarts.SELECTED));

    let tinhtongtien = 0;
    listItemCarts.map((item) =>
      item.SELECTED === 1
        ? (tinhtongtien = tinhtongtien + item.TONGGIA)
        : tinhtongtien
    );
    setTongTienAllItem(tinhtongtien);

    const infoUpdateSelectedProperty = {
      matk: localStorage.getItem("auth_matk"),
      masp: listItemCarts[index].MASP,
      mamau: listItemCarts[index].MAMAU,
      masize: listItemCarts[index].MASIZE,

      selected: listItemCarts[index].SELECTED,
    };
    console.log(typeof infoUpdateSelectedProperty.selected, "okokok");
    try {
      request
        .post("/api/updateSelectedProperty", infoUpdateSelectedProperty)
        .then((res) => {
          console.log(res.data.message);
        });
    } catch (err) {
      console.log(err);
    }
  };

  const hanelInputSoLuong = (index, event) => {
    const ListItemCarts = [...itemCarts];
    ListItemCarts[index].SOLUONG = parseInt(
      event.target.value === "" || event.target.value === NaN
        ? 0
        : event.target.value,
      10
    );
    ListItemCarts[index].TONGGIA =
      ListItemCarts[index].SOLUONG * ListItemCarts[index].GIABAN;
    setItemCart(ListItemCarts);

    let tinhtongtien = 0;
    ListItemCarts.map((item) => (tinhtongtien = tinhtongtien + item.TONGGIA));
    setTongTienAllItem(tinhtongtien);

    const infoUpdateQuantityItemCart = {
      matk: parseInt(localStorage.getItem("auth_matk")),
      masp: itemCarts[index].MASP,
      mamau: itemCarts[index].MAMAU,
      masize: itemCarts[index].MASIZE,
      soluong: itemCarts[index].SOLUONG,
      tonggia: itemCarts[index].SOLUONG * itemCarts[index].GIABAN,
    };

    try {
      request
        .post("/api/updateQuantityProperty", infoUpdateQuantityItemCart)
        .then((res) => {
          console.log(res.data.matk);
        });
    } catch (err) {
      console.log(err);
    }
  };
  const handleClickDelete = (index) => {
    const infoDeleteItemCart = {
      matk: parseInt(localStorage.getItem("auth_matk")),
      masp: itemCarts[index].MASP,
      mamau: itemCarts[index].MAMAU,
      masize: itemCarts[index].MASIZE,
    };

    request.post("/api/deleteItemCart", infoDeleteItemCart).then((res) => {
      console.log(res.data.message);
    });

    itemCarts.splice(index, 1);

    const listItemCarts = [...itemCarts];
    setItemCart(listItemCarts);

    let tinhtongtien = 0;
    listItemCarts.map((item) => (tinhtongtien = tinhtongtien + item.TONGGIA));
    setTongTienAllItem(tinhtongtien);
  };
  return (
    <tbody>
      {itemCarts.map((item, index) => (
        <tr className={row1} key={index}>
          <td>
            <input
              type="checkbox"
              name="checkboxProductInCart"
              checked={item.SELECTED === 1}
              onChange={() => handleClickCheckbox(index)}
            />
          </td>

          <td>
            <div className={boxRow1Column1}>
              <div className={row1Column1Item}>
                <img className={imgRow1} src={item.imgURL} alt="" />
              </div>
              <div className={row1Column1Item}>
                <p>
                  {item.TENSP} <br />
                  Màu: {item.TENMAU} <br />
                  Size: {item.MASIZE}
                </p>
              </div>
            </div>
          </td>

          <td>
            <div className={`${boxRow1} $`}>
              <b className={row1Item}>{formatPrice(item.GIABAN)} đ</b>
            </div>
          </td>

          <td>
            <div className={`${boxRow1} `}>
              <input
                type="number"
                min={1}
                value={item.SOLUONG}
                onChange={(event) => hanelInputSoLuong(index, event)}
                className={`${inputNumber} ${row1Item}`}
              />
            </div>
          </td>

          <td>
            <div className={`${boxRow1} `}>
              <b className={row1Item}>{formatPrice(item.TONGGIA)} đ</b>
            </div>
          </td>

          <td>
            <div className={`${boxRow1} `}>
              <button
                className={btnDeleteCart}
                onClick={() => handleClickDelete(index)}
              >
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </div>
          </td>
        </tr>
      ))}
    </tbody>
  );
};

export default BodyCard;
