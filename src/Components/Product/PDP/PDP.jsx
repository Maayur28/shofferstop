import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { fetchGet, fetchPost } from "../../FetchData";
import Cookies from "universal-cookie";
import "react-image-gallery/styles/css/image-gallery.css";
import { message, Typography, Divider, Button, Progress, Rate } from "antd";
import ShowMoreText from "react-show-more-text";
import {
  ShoppingCartOutlined,
  HeartOutlined,
  StarFilled,
} from "@ant-design/icons";
import "./PDP.css";
import ImageGallery from "react-image-gallery";
import SimilarProduct from "../SimilarProduct";
import { StoreContext } from "./../../../Store/data";
import deleteAllCookies from "../../Util";
import RatingStar from "../RatingStar";

const { Title, Text } = Typography;

const PDP = () => {
  const { isLogin, setisLogin } = useContext(StoreContext);
  const { productId } = useParams();
  const cookies = new Cookies();
  const [apiCalled, setapiCalled] = useState(false);
  const [productData, setProductData] = useState({});
  const [ratingData, setRatingData] = useState({});
  const [carouselImage, setcarouselImage] = useState([]);
  const [rateProduct, setRateProduct] = useState(false);
  const [rateValue, setrateValue] = useState();

  const desc = ["terrible", "bad", "satisfactory", "good", "excellent"];

  useEffect(() => {
    getProduct();
  }, [productId]);

  useEffect(() => {
    setRateProduct(false);
    setrateValue(0);
  }, [isLogin]);

  const getRating = async (productName) => {
    setapiCalled(true);
    if (isLogin && productName != null) {
      const options = {
        method: "GET",
        headers: {
          Authorization: `Bearer ${cookies.get("accessToken")}`,
        },
      };
      fetch("https://shofferstop-userservice.herokuapp.com/users", options)
        .then((response) => response.json())
        .then((data) => {
          if (data != null) {
            getRatingCalled(data.userId, productName);
          } else {
            deleteAllCookies();
            setisLogin(false);
          }
        })
        .catch(() => {
          deleteAllCookies();
          setisLogin(false);
        });
    } else {
      deleteAllCookies();
      setisLogin(false);
      getRatingCalled(null, productName);
    }
    setapiCalled(false);
  };

  const getRatingCalled = async (userId, productName) => {
    const response = await fetchGet(
      "https://shofferstop-prodservice.herokuapp.com/product/ratings?" +
        new URLSearchParams({
          userId: userId,
          productName: productName,
        })
    );
    setRatingData({ ...response });
    setrateValue(response.userRating);
    setRateProduct(false);
  };

  const getProduct = async () => {
    setapiCalled(true);
    try {
      const response = await fetchGet(
        `https://shofferstop-prodservice.herokuapp.com/product/${productId}`
      );
      getRating(response.productName);
      setProductData({ ...constructProd(response) });
      setapiCalled(false);
    } catch (err) {
      message.error(err.message);
    }
  };

  const constructProd = (product) => {
    if (product != null && product.prodImage.length > 0) {
      if (product.prodImage) {
        let carouselimage = [];
        let images = product.prodImage.replace("[", "");
        images = images.replace("]", "");
        images = images.split(",");
        let newImageArray = [];
        for (let i in images) {
          if (images[i].includes("http://img5a")) {
            images[i] = images[i].replace("http://img5a", "https://rukminim1");
          }
          if (images[i].includes("http://img6a")) {
            images[i] = images[i].replace("http://img6a", "https://rukminim1");
          }
          images[i] = images[i].trim();
          newImageArray[i] = images[i].substring(1, images[i].length - 1);
          carouselimage.push({
            original: newImageArray[i],
            thumbnail: newImageArray[i],
            originalHeight: "400px",
            originalWidth: "400px",
            thumbnailHeight: "50px",
            thumbnailWidth: "50px",
          });
        }
        product.prodImage = newImageArray;
        setcarouselImage(carouselimage);
      }
    }
    return product;
  };

  const rateProductCalled = () => {
    setRateProduct(!rateProduct);
  };

  const rateCalled = (value) => {
    setrateValue(value);
    setapiCalled(true);
    if (isLogin && value >= 1 && value <= 5) {
      const options = {
        method: "GET",
        headers: {
          Authorization: `Bearer ${cookies.get("accessToken")}`,
        },
      };
      fetch("https://shofferstop-userservice.herokuapp.com/users", options)
        .then((response) => response.json())
        .then((data) => {
          if (data != null) {
            postRatingCalled(data.userId, value);
          } else {
            deleteAllCookies();
            setisLogin(false);
          }
        })
        .catch(() => {
          deleteAllCookies();
          setisLogin(false);
        });
    } else {
      deleteAllCookies();
      setisLogin(false);
      message.error("Please login to rate!!!");
    }
    setapiCalled(false);
  };

  const postRatingCalled = async (userId, value) => {
    let values = {};
    if (
      userId != null &&
      productData.productName != null &&
      value != null &&
      value !== 0
    ) {
      values.userId = userId;
      values.productName = productData.productName;
      values.rating = value;
      const response = await fetchPost(
        "https://shofferstop-prodservice.herokuapp.com/product/ratings",
        values
      );
      setRatingData({ ...response });
      message.success("Rated successfully!!!");
      setRateProduct(false);
    }
  };

  return (
    <div className="pdp">
      <div className="pdp_prod">
        <div className="pdp_image">
          {productData != null &&
            productData.prodImage != null &&
            productData.prodImage.length > 0 && (
              <ImageGallery
                items={carouselImage}
                showFullscreenButton={false}
                showPlayButton={false}
                autoPlay={true}
                slideInterval={2000}
                showNav={false}
                slideOnThumbnailOver={true}
                c
              />
            )}
        </div>
        <div id="myPortal" />
        <div className="pdp_desc">
          <div className="pdp_desc_top">
            <Title level={3} style={{}}>
              {productData.prodBrand}
            </Title>
            <Text type="secondary" style={{ fontSize: "20px" }}>
              {productData.productName}
            </Text>
            <div style={{}}>
              <Text strong style={{ fontSize: "20px", marginRight: "5px" }}>
                ₹{productData.discountedPrice}
              </Text>
              {productData.discountedPrice !== productData.retailPrice && (
                <>
                  <Text
                    delete
                    type="secondary"
                    style={{ fontSize: "18px", marginRight: "5px" }}
                  >
                    ₹{productData.retailPrice}
                  </Text>
                  <Text type="success" strong style={{ fontSize: "18px" }}>
                    {Math.round(
                      ((productData.retailPrice - productData.discountedPrice) /
                        productData.retailPrice) *
                        100
                    )}
                    % off
                  </Text>
                </>
              )}
            </div>
            <div style={{ margin: "20px 0px" }}>
              <Button
                type="primary"
                danger
                icon={<ShoppingCartOutlined />}
                size="large"
                shape="round"
                style={{ marginRight: "15px" }}
              >
                Add to bag
              </Button>
              <Button
                danger
                icon={<HeartOutlined />}
                size="large"
                shape="round"
              >
                Wishlist
              </Button>
            </div>
          </div>
          <Divider />
          <div className="pdp_desc_bottom">
            <Title level={4} style={{ textAlign: "left" }}>
              Product Description
            </Title>
            <ShowMoreText
              lines={3}
              more="Show more"
              less="Show less"
              className="content-css"
              expanded={false}
              truncatedEndingComponent={"... "}
            >
              {productData.prodDescription}
            </ShowMoreText>
          </div>
          <Divider />
          <div className="pdp_desc_rating">
            <div className="pdp_desc_rating_heading">
              <Title level={4} style={{ textAlign: "left" }}>
                Rating
              </Title>
              <Button onClick={rateProductCalled}>Rate Product</Button>
            </div>
            {!rateProduct ? (
              <div className="pdp_desc_rating_rating">
                <RatingStar ratingData={ratingData} />
              </div>
            ) : isLogin ? (
              <div className="rating_rate">
                <Title level={5}>You rated:</Title>
                <span>
                  <Rate
                    disabled={apiCalled}
                    tooltips={desc}
                    onChange={rateCalled}
                    value={rateValue}
                  />
                  {rateValue ? (
                    <span className="ant-rate-text">{desc[rateValue - 1]}</span>
                  ) : (
                    ""
                  )}
                </span>
              </div>
            ) : (
              <div className="rating_rate">
                <Title level={5}>Please login to rate</Title>
              </div>
            )}
          </div>
        </div>
      </div>
      <Divider />
      <Title level={3} style={{ textAlign: "left" }}>
        Similar Products
      </Title>
      <div className="pdp_simi_product">
        <SimilarProduct
          categoryId={productData.productCategory}
          productName={productData.productName}
        />
      </div>
    </div>
  );
};

export default PDP;
