import React from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import "./Menu.css";
import { Typography } from "antd";
import getCategory from "./category";
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
        <Title level={5} key={`${val}+${index}`} className="category__item">
          {val}
        </Title>
      ))}
    </Carousel>
  );
};

export default Menu;
