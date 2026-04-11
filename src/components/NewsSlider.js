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
    slidesToShow: 3.75,
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
      <div className="ai-news-slider-header">
        <div className="ai-news-slider-header-left">
          <div className="strata-section-title">RECENT NEWS</div>
          <h4>Learn why the identity layer for agentic AI is making waves</h4>
        </div>
        <div className="ai-news-slider-header-right">
          <button
            className="slider-nav-btn prev-btn"
            onClick={() => sliderRef.current?.slickPrev()}
            aria-label="Previous"
          />
          <button
            className="slider-nav-btn next-btn"
            onClick={() => sliderRef.current?.slickNext()}
            aria-label="Next"
          />
        </div>
      </div>
      <div className="news-slider">
        <Slider ref={sliderRef} {...settings}>
          {items.map((item, index) => (
            <div key={index} className="news-card">
              <div
                className="news-card-image"
                style={{
                  backgroundImage: item.image ? `url(${item.image})` : "none",
                }}
              >
                <span className="post-cat-meta-item">
                  {item.category || "Agentic Identity"}
                </span>
                <div className="post-title-mask" />
              </div>
              <div className="news-card-content">
                <span className="news-card-title">{item.title}</span>
                {item.excerpt && (
                  <p className="news-card-excerpt">{item.excerpt}</p>
                )}
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
      image: PropTypes.string,
    })
  ),
};

export default NewsSlider;
