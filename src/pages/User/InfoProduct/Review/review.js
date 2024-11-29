import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping, faStar } from "@fortawesome/free-solid-svg-icons";
import { faStar as farStarRegular } from "@fortawesome/free-regular-svg-icons";
import style from "./review.module.scss";

const {
  review,
  reviewHeading,
  reviewContainer,
  reviewBoxContainer,
  reviewBox,
  boxTop,
  profile,
  profileImage,
  user,
  userName,
  clientsComment,
  starRate,
} = style;

const Review = ({ productReviews }) => {
  const renderStarAtReviewProduct = (SOLUONG_SAO) => {
    const stars = [];
    for (let i = 1; i <= SOLUONG_SAO; i++) {
      stars.push(
        <FontAwesomeIcon icon={faStar} className={starRate}></FontAwesomeIcon>
      );
    }
    return stars;
  };

  const renderReview = productReviews.map((item) => (
    <div className={reviewBoxContainer}>
      <div className={reviewBox}>
        <div className={boxTop}>
          <div className={profile}>
            <div className={profileImage}>
              <img
                src="https://nhacchuonghinhnen.com/wp-content/uploads/2020/03/hinh-nen-gai-xinh-full-hd-cho-dien-thoai-2-scaled.jpg"
                alt=""
              />
            </div>
            <div className={user}>
              <div className={userName}>
                <strong>{item.TEN}</strong>
              </div>
              <div>{renderStarAtReviewProduct(item.SOLUONG_SAO)}</div>
            </div>
          </div>
        </div>
        <div className={clientsComment}>
          <p>{item.NOIDUNG_DANHGIA}</p>
        </div>
      </div>
    </div>
  ));

  return (
    <section className={review}>
      <div className={reviewHeading}>
        <h1>Đánh giá</h1>
      </div>
      <div className={reviewContainer}>
        {productReviews.length > 0 ? renderReview : "Chưa có đánh giá"}
      </div>
    </section>
  );
};

export default Review;
