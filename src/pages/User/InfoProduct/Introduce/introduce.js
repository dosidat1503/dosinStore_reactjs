import style from "./introduce.module.scss";

const { headerContainer, bodyContainer, describe } = style;

const Introduce = ({ content, textareaRef }) => {
  return (
    <>
      <div className={headerContainer}>
        <ul className="nav nav-underline">
          <li className="nav-item  active nav-link nav-underline">
            Giới thiệu
          </li>
        </ul>
      </div>
      <div className={bodyContainer}>
        <textarea
          ref={textareaRef}
          value={content}
          className={describe}
          cols="60"
          rows="1"
          disabled
        ></textarea>
      </div>
    </>
  );
};

export default Introduce;
