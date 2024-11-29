import clsx from "clsx";
import style from "./typeChose.module.scss";

const choseType = {
  mamau: "mamau",
  masize: "masize",
  soluong: "soluong",
};

const TypeChose = ({
  setSelectPropertyProduct,
  selectPropertyProduct,
  infoProduct,
  setHetHang,
}) => {
  const handleClickButtonChangeQuantity = (e) => {
    let newQuantity = parseInt(selectPropertyProduct.soluong);
    if (e.target.value === "-" && parseInt(selectPropertyProduct.soluong) > 1) {
      newQuantity = parseInt(selectPropertyProduct.soluong) - 1;
    } else if (e.target.value === "+") {
      newQuantity = parseInt(selectPropertyProduct.soluong) + 1;
    }

    setSelectPropertyProduct({
      ...selectPropertyProduct,
      soluong: newQuantity,
    });
  };

  const handleChoseProductType = (e) => {
    let { name, value } = e.target;
    setHetHang(false);
    if (name === choseType.soluong) {
      if (!/^\d*$/.test(value)) {
        return;
      }
    }
    if (name === choseType.mamau) value = parseInt(value);
    setSelectPropertyProduct({
      ...selectPropertyProduct,
      [name]: value,
    });
  };
  return (
    <>
      <div className={clsx(style.container, style.colorContainer)}>
        <div className={style.headerText}>
          <span>Màu sắc</span>
        </div>
        <div className={style.choseList}>
          {infoProduct.data_mamau.map((item, index) => {
            return (
              <div className={style.colorItem} key={index}>
                <input
                  type="radio"
                  className={style.inputColor}
                  id={"color_" + index}
                  name={choseType.mamau}
                  onChange={handleChoseProductType}
                  value={item.MAMAU}
                />
                <label
                  for={"color_" + index}
                  className={clsx(style.labelColor, {
                    [style.chooseColorBorder]:
                      selectPropertyProduct.mamau === item.MAMAU,
                  })}
                  style={{
                    backgroundColor: item.HEX,
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>
      <div className={style.container}>
        <div className={style.headerText}>Kích thước</div>
        <div className={style.choseList}>
          {infoProduct.data_size.map((item, index) => {
            return (
              <div className={style.sizeItem} key={index}>
                <input
                  type="radio"
                  className={style.inputSize}
                  id={"size_" + index}
                  name={choseType.masize}
                  onChange={handleChoseProductType}
                  value={item.MASIZE}
                />
                <label
                  for={"size_" + index}
                  className={clsx(style.labelSize, {
                    [style.chooseColorBorder]:
                      selectPropertyProduct.masize === item.MASIZE,
                  })}
                >
                  <span className={style.text}>{item.MASIZE}</span>
                </label>
              </div>
            );
          })}
        </div>
      </div>
      <div className={style.container}>
        <div className={style.headerText}>Số lượng</div>
        <div className={style.quantityChange}>
          <input
            type="button"
            value="-"
            className={style.changeByButton}
            onClick={handleClickButtonChangeQuantity}
          />
          <input
            type="text"
            onChange={handleChoseProductType}
            value={selectPropertyProduct.soluong}
            min={1}
            name={choseType.soluong}
            className={style.changeByInput}
          />
          <input
            type="button"
            value="+"
            className={style.changeByButton}
            onClick={handleClickButtonChangeQuantity}
          />
        </div>
      </div>
    </>
  );
};

export default TypeChose;
