import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Image, Divider, Skeleton } from "antd";
import { fetchGet } from "../FetchData";
import Slider from "react-slick";
import "./HomePage.css";
import AtProd from "./AtProd";

const HomePage = () => {
  let navigate = useNavigate();
  const [promotions, setPromotions] = useState({});

  var settings = {
    dots: false,
    infinite: true,
    speed: 1500,
    autoplaySpeed: 4000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
  };

  useEffect(() => {
    setPromotions({});
    let promo = JSON.parse(localStorage.getItem("homePage"));
    const current = new Date();
    const date = `${
      current.getFullYear() < 10
        ? `0${current.getFullYear()}`
        : current.getFullYear()
    }-${
      current.getMonth() + 1 < 10
        ? `0${current.getMonth() + 1}`
        : current.getMonth() + 1
    }-${current.getDate() < 10 ? `0${current.getDate()}` : current.getDate()}`;
    if (promo != null && date === promo.date) {
      setPromotions({ ...promo });
    } else {
      getPromo();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const getPromo = async () => {
    let response = await fetchGet(
      `https://product.shofferstop.in/product/promotions`,
      ""
    );
    response.at99 = constructProd(response.at99);
    response.at499 = constructProd(response.at499);
    response.at999 = constructProd(response.at999);
    setPromotions({ ...response });
  };

  useEffect(() => {
    if (Object.keys(promotions).length > 0) {
      localStorage.setItem("homePage", JSON.stringify(promotions));
    }
  }, [promotions]);

  const constructProd = (products) => {
    if (products != null && products.length > 0) {
      products.forEach((val) => {
        if (val.prodImage) {
          let images = val.prodImage.replace("[", "");
          images = images.replace("]", "");
          images = images.split(",");
          if (images[0].includes("http://img5a")) {
            images[0] = images[0].replace("http://img5a", "https://rukminim1");
          }
          if (images[0].includes("http://img6a")) {
            images[0] = images[0].replace("http://img6a", "https://rukminim1");
          }
          val.prodImage = images[0].substring(1, images[0].length - 1);
        }
      });
    }
    return products;
  };

  const pdpCalled = (name) => {
    navigate(`/product/${name}`);
  };

  return (
    <div className="homePage">
      <div className="carousel">
        {Object.keys(promotions).length > 0 ? (
          <Slider {...settings}>
            {Object.keys(promotions).length > 0 &&
              promotions.carouselPromo.map((val, index) => (
                <div key={index} style={{ backgroundColor: "#F6F8FA" }}>
                  <Image
                    alt={val.productName}
                    src={index ? "flashSale.jpg" : "/bogo.jpg"}
                    style={{
                      width: "100%",
                      height: "400px",
                      cursor: "pointer",
                    }}
                    fallback="/image_not_available.png"
                    preview={false}
                    onClick={() => pdpCalled(val.productName)}
                  />
                </div>
              ))}
          </Slider>
        ) : (
          <div style={{ textAlign: "left" }}>
            <Skeleton.Input
              active={true}
              style={{ marginTop: "0px", height: "400px", width: "97vw" }}
            />
          </div>
        )}
      </div>
      <Divider />
      {Object.keys(promotions).length > 0 && promotions.at99.length > 0 ? (
        <div className="site-card-wrapper">
          <div style={{ margin: "20px 0px" }}>
            <AtProd
              prod={promotions.at99}
              title="At ₹99 Only"
              pdpCalled={pdpCalled}
            />
          </div>
          <div>
            <AtProd
              prod={promotions.at499}
              title="At ₹499 Only"
              pdpCalled={pdpCalled}
            />
          </div>
          <div>
            <AtProd
              prod={promotions.at999}
              title="At ₹999 Only"
              pdpCalled={pdpCalled}
            />
          </div>
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginRight: "2vw",
          }}
        >
          <Skeleton.Input
            active={true}
            style={{ marginTop: "0px", height: "250px", width: "20vw" }}
          />
          <Skeleton.Input
            active={true}
            style={{ marginTop: "0px", height: "250px", width: "20vw" }}
          />
          <Skeleton.Input
            active={true}
            style={{ marginTop: "0px", height: "250px", width: "20vw" }}
          />
          <Skeleton.Input
            active={true}
            style={{ marginTop: "0px", height: "250px", width: "20vw" }}
          />
        </div>
      )}
    </div>
  );
};

export default HomePage;
