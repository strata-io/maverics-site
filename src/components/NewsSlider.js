import React, { useRef } from "react";
import PropTypes from "prop-types";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const NewsSlider = ({ items }) => {
  const sliderRef = useRef(null);

  if (!items || items.length === 0) return null;

  const settings = {
    dots: false,
    arrows: false,
    infinite: false,
    speed: 500,
    swipeToSlide: true,
    slidesToShow: 3.5,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1080,
        settings: {
          slidesToShow: 2.5,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1.2,
        },
      },
    ],
  };

  return (
    <section className="mav-news">
      <div className="news-header">
        <div className="news-header-left">
          <h2>RECENT NEWS</h2>
          <p>Learn why the identity layer for agentic AI is making waves</p>
        </div>
        <div className="news-nav">
          <button
            onClick={() => sliderRef.current?.slickPrev()}
            aria-label="Previous"
          >
            &#8592;
          </button>
          <button
            onClick={() => sliderRef.current?.slickNext()}
            aria-label="Next"
          >
            &#8594;
          </button>
        </div>
      </div>
      <div className="news-slider">
        <Slider ref={sliderRef} {...settings}>
          {items.map((item, index) => (
            <div key={index} className="news-card">
              <div className="news-card-inner">
                <span className="news-category">
                  {item.category || "Agentic Identity"}
                </span>
                <h3>{item.title}</h3>
                <p>{item.excerpt}</p>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
};

NewsSlider.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      excerpt: PropTypes.string,
      category: PropTypes.string,
    })
  ),
};

export default NewsSlider;
