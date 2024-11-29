import images from "../../../../assets/images";

const href = {
  collection1: "/collection1?mapl_sp=1",
  collection2: "/collection2?mapl_sp=2",
  collection3: "/collection3?mapl_sp=3",
};

const Banner = () => {
  const { collection1, collection2, collection3 } = href;
  return (
    <div id="demo" className="carousel slide" data-bs-ride="carousel">
      {/* <!-- Indicators/dots --> */}
      <div className="carousel-indicators">
        <button
          type="button"
          data-bs-target="#demo"
          data-bs-slide-to="0"
          className="active"
        ></button>
        <button
          type="button"
          data-bs-target="#demo"
          data-bs-slide-to="1"
        ></button>
        <button
          type="button"
          data-bs-target="#demo"
          data-bs-slide-to="2"
        ></button>
      </div>

      {/* <!-- The slideshow/carousel --> */}
      <div className="carousel-inner carousel_img">
        <div className="carousel-item active">
          <a href="/collection2?mapl_sp=2">
            <img
              src={images.main_slide_la}
              alt="Los Angeles"
              className="d-block w-100 carousel_img"
            />
          </a>
        </div>
        <div className="carousel-item carousel_img">
          <a href="/collection3?mapl_sp=3">
            <img
              src={images.main_slide_chicago}
              alt="Chicago"
              className="d-block w-100 carousel_img"
            />
          </a>
        </div>
        <div className="carousel-item carousel_img">
          <a href="/collection1?mapl_sp=1">
            <img
              src={images.main_slide_ny}
              alt="New York"
              href="/collection1?mapl_sp=1"
              className="d-block w-100 carousel_img"
            />
          </a>
        </div>
      </div>

      {/* <!-- Left and right controls/icons --> */}
      <button
        className="carousel-control-prev"
        type="button"
        data-bs-target="#demo"
        data-bs-slide="prev"
      >
        <span className="carousel-control-prev-icon"></span>
      </button>
      <button
        className="carousel-control-next"
        type="button"
        data-bs-target="#demo"
        data-bs-slide="next"
      >
        <span className="carousel-control-next-icon"></span>
      </button>
    </div>
  );
};

export default Banner;
