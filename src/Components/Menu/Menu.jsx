import React from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import "./Menu.css";
import { Typography } from "antd";
import getCategory from "./category";
import { useNavigate } from "react-router-dom";
const category = getCategory();

const { Title } = Typography;
const responsive = {
  desktop: {
    breakpoint: { max: 5000, min: 1024 },
    items: 9,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 7,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 5,
  },
};

const Menu = () => {
  let navigate = useNavigate();
  const categoryCalled = (val) => {
    console.log(val);
    navigate(`/category/${val}`);
  };
  return (
    <Carousel
      swipeable={true}
      draggable={false}
      showDots={false}
      responsive={responsive}
      ssr={true}
      infinite={true}
      // autoPlay={this.props.deviceType !== "mobile" ? true : false}
      autoPlaySpeed={1000}
      keyBoardControl={true}
      customTransition="transform 300ms ease-in-out"
      transitionDuration={100}
      containerClass="carousel-container"
      //deviceType={this.props.deviceType}
      dotListClass="custom-dot-list-style"
      itemClass="carousel-item"
      sliderClass="react-multi-carousel-track"
    >
      {category.map((val, index) => (
        <Title
          key={`${val}+${index}`}
          level={5}
          className="category__item"
          onClick={() => categoryCalled(val)}
        >
          {val}
        </Title>
      ))}
    </Carousel>
  );
};

export default Menu;
