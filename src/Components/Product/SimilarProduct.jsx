import React, { useEffect, useState } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { fetchGet } from "../FetchData";
import { Card, Typography, Skeleton } from "antd";
import { useNavigate } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";

const { Text, Paragraph } = Typography;
const { Meta } = Card;

const responsive = {
  desktop: {
    breakpoint: { max: 5000, min: 1400 },
    items: 7,
  },
  laptop: {
    breakpoint: { max: 1400, min: 1000 },
    items: 5,
  },
  tablet: {
    breakpoint: { max: 1000, min: 700 },
    items: 3,
  },
  mobile: {
    breakpoint: { max: 700, min: 0 },
    items: 2,
  },
};

const SimilarProduct = ({ categoryId, productName }) => {
  let navigate = useNavigate();
  const [apiCalled, setapiCalled] = useState(false);
  const [products, setProducts] = useState([]);
  useEffect(() => {
    getProduct();
  }, [categoryId]);

  const pdpCalled = (name) => {
    navigate(`/${name}`);
  };

  const getProduct = async () => {
    setapiCalled(true);
    setProducts([]);
    try {
      const response = await fetchGet(
        `https://shofferstop-prodservice.herokuapp.com/product/category/${categoryId}?` +
          new URLSearchParams({
            sortBy: "popularity",
            filter: "{}",
            page: 1,
            pageSize: 50,
          })
      );
      setProducts(constructProd(response.products));
      setapiCalled(false);
    } catch (err) {}
  };
  const constructProd = (products) => {
    if (products != null && products.length > 0) {
      let i = -1,
        index = -1;
      products.forEach((val) => {
        i++;
        if (val.productName === productName) {
          index = i;
        }
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
      if (index !== -1) {
        products.splice(index, 1);
      }
    }
    return products;
  };
  return (
    <div className="similar_product">
      <Carousel
        swipeable={true}
        draggable={false}
        responsive={responsive}
        ssr={true}
        infinite={true}
        autoPlay={false}
        autoPlaySpeed={1000}
        keyBoardControl={true}
        customTransition="all .5"
        transitionDuration={500}
        containerClass="carousel-container_similar_product"
        removeArrowOnDeviceType={["tablet", "mobile"]}
        itemClass="carousel-item-padding-40-px"
      >
        {!apiCalled ? (
          products.map((val, index) => (
            <Card
              hoverable
              className="card_similar_product"
              key={index}
              style={{ textAlign: "center" }}
              onClick={() => pdpCalled(val.productName)}
              cover={
                <LazyLoadImage
                  style={{
                    padding: "25px 25px",
                  }}
                  alt={val.productName}
                  src={val.prodImage}
                  width="100%"
                  height="200px"
                />
              }
              actions={[]}
            >
              <Meta
                style={{ textAlign: "left" }}
                title={
                  val.prodBrand == null || val.prodBrand === undefined
                    ? "Brand not available"
                    : val.prodBrand
                }
                description={
                  <Paragraph ellipsis={true}>{val.productName}</Paragraph>
                }
              />
              <div style={{ textAlign: "left" }}>
                <Text strong style={{ fontSize: "16px", marginRight: "5px" }}>
                  ₹{val.discountedPrice}
                </Text>
                {val.discountedPrice !== val.retailPrice && (
                  <>
                    <Text
                      delete
                      type="secondary"
                      style={{ fontSize: "14px", marginRight: "5px" }}
                    >
                      ₹{val.retailPrice}
                    </Text>
                    <Text type="success" strong style={{ fontSize: "14px" }}>
                      {Math.round(
                        ((val.retailPrice - val.discountedPrice) /
                          val.retailPrice) *
                          100
                      )}
                      % off
                    </Text>
                  </>
                )}
              </div>
            </Card>
          ))
        ) : (
          <div style={{ display: "flex" }}>
            <Skeleton.Input
              active={true}
              className="plp_product"
              style={{ marginTop: "0px", height: "200px" }}
            />
            <Skeleton.Input
              active={true}
              className="plp_product"
              style={{ marginTop: "0px", height: "200px" }}
            />
            <Skeleton.Input
              active={true}
              className="plp_product"
              style={{ marginTop: "0px", height: "200px" }}
            />
            <Skeleton.Input
              active={true}
              className="plp_product"
              style={{ marginTop: "0px", height: "200px" }}
            />
            <Skeleton.Input
              active={true}
              className="plp_product"
              style={{ marginTop: "0px", height: "200px" }}
            />
          </div>
        )}
      </Carousel>
    </div>
  );
};

export default SimilarProduct;