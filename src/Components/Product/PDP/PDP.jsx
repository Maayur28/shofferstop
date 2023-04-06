import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchGet, fetchPost } from "../../FetchData";
import Cookies from "universal-cookie";
import "react-image-gallery/styles/css/image-gallery.css";
import { message, Typography, Divider, Button, Rate, Skeleton } from "antd";
import ShowMoreText from "react-show-more-text";
import {
  ShoppingCartOutlined,
  HeartOutlined,
  HeartFilled,
} from "@ant-design/icons";
import "./PDP.css";
import ImageGallery from "react-image-gallery";
import SimilarProduct from "../SimilarProduct";
import { StoreContext } from "./../../../Store/data";
import deleteAllCookies from "../../Util";
import RatingStar from "../RatingStar";
import axios from "axios";

const { Title, Text } = Typography;

const PDP = () => {
  const { isLogin, setisLogin, setCartCount, userId } =
    useContext(StoreContext);
  let navigate = useNavigate();
  const { productId } = useParams();
  const cookies = new Cookies();
  const [apiCalled, setapiCalled] = useState(false);
  const [productData, setProductData] = useState({});
  const [ratingData, setRatingData] = useState({});
  const [carouselImage, setcarouselImage] = useState([]);
  const [rateProduct, setRateProduct] = useState(false);
  const [rateValue, setrateValue] = useState();
  const [similarProd, setSimilarProd] = useState(false);
  const [wishlisted, setwishlisted] = useState(false);
  const [presentInBag, setPresentInBag] = useState(false);

  const desc = ["terrible", "bad", "satisfactory", "good", "excellent"];

  useEffect(() => {
    setPresentInBag(false);
    setRatingData({});
    setProductData({});
    setwishlisted(false);
    setSimilarProd(false);
    getProduct();
  }, [productId]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setRateProduct(false);
    setPresentInBag(false);
    if (isLogin === false) {
      setrateValue(0);
      setwishlisted(false);
    } else {
      setRatingData({});
      setProductData({});
      setSimilarProd(false);
      setwishlisted(false);
      getProduct();
    }
  }, [isLogin]); // eslint-disable-line react-hooks/exhaustive-deps

  const getRating = async (productName) => {
    setapiCalled(true);
    if (isLogin && productName != null) {
      getRatingCalled(userId, productName);
    } else {
      deleteAllCookies();
      setisLogin(false);
      getRatingCalled(null, productName);
    }
    setapiCalled(false);
  };

  const getRatingCalled = async (userId, productName) => {
    const response = await fetchGet(
      "https://shofferstopprodservice.up.railway.app/product/ratings?" +
        new URLSearchParams({
          userId: userId,
          productName: productName,
        })
    );
    setRatingData({ ...response });
    setrateValue(response.userRating);
    setRateProduct(false);
  };

  const getWishlistCalled = async (productName) => {
    const response = await fetchGet(
      `https://shofferstopuserservice.up.railway.app/users/wishlist/${productName}`,
      cookies.get("accessToken")
    );
    setwishlisted(response.wishlisted);
  };

  const getProduct = async () => {
    setapiCalled(true);
    try {
      const response = await fetchGet(
        `https://shofferstopprodservice.up.railway.app/product/${productId}?` +
          new URLSearchParams({
            userId: userId,
          })
      );
      setPresentInBag(response.presentInBag);
      setSimilarProd(true);
      getWishlistCalled(response.productName);
      getRating(response.productName);
      setProductData({ ...constructProd(response) });
      setapiCalled(false);
    } catch (err) {
      message.error(err.message);
    }
    setapiCalled(false);
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
          axios
            .get(newImageArray[i])
            .then((data) => {
              carouselimage.push({
                original: newImageArray[i],
                thumbnail: newImageArray[i],
                originalHeight: "400px",
                originalWidth: "400px",
                thumbnailHeight: "50px",
                thumbnailWidth: "50px",
              });
            })
            .catch((error) => {
              carouselimage.push({
                original: "/image_not_available.png",
                thumbnail: "/image_not_available.png",
                originalHeight: "400px",
                originalWidth: "400px",
                thumbnailHeight: "50px",
                thumbnailWidth: "50px",
              });
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
      postRatingCalled(userId, value);
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
        "https://shofferstopprodservice.up.railway.app/product/ratings",
        values
      );
      setRatingData({ ...response });
      message.success("Rated successfully!!!");
      setRateProduct(false);
    }
  };

  const pdpWishlistCalled = async (productName) => {
    if (isLogin && productName != null) {
      let values = {};
      values.productName = productName;
      const response = await fetchPost(
        "https://shofferstopuserservice.up.railway.app/users/wishlist",
        values,
        cookies.get("accessToken")
      );
      if (response.products.includes(productName)) {
        setwishlisted(true);
      } else {
        setwishlisted(false);
      }
    } else {
      deleteAllCookies();
      setisLogin(false);
      message.info("Please login to wishlist");
    }
  };

  const getUserAddToCart = async () => {
    if (presentInBag) {
      navigate("/cart");
    } else {
      setapiCalled(true);
      if (isLogin) {
        addToCart(userId);
        setPresentInBag(true);
        message.success("Added to bag");
      } else {
        deleteAllCookies();
        setisLogin(false);
        message.error("Please login to continue!!!");
      }
      setapiCalled(false);
    }
  };

  const addToCart = async (userId) => {
    let values = {};
    values.productName = productData.productName;
    values.retailPrice = productData.retailPrice;
    values.discountedPrice = productData.discountedPrice;
    values.productImage = productData.prodImage[0];
    values.productBrand = productData.prodBrand;
    values.quantity = 1;
    const response = await fetchPost(
      `https://shofferstopprodservice.up.railway.app/cart/${userId}`,
      values,
      ""
    );
    setCartCount(response);
  };

  return (
    <div className="pdp">
      <div className="pdp_prod">
        <div className="pdp_image">
          {!apiCalled &&
          productData != null &&
          productData.prodImage != null &&
          productData.prodImage.length > 0 ? (
            <ImageGallery
              items={carouselImage}
              showFullscreenButton={false}
              showPlayButton={false}
              autoPlay={true}
              slideInterval={2000}
              showNav={false}
              slideOnThumbnailOver={true}
            />
          ) : (
            <Skeleton.Input
              active={true}
              className="plp_product"
              style={{ marginTop: "0px", height: "400px", width: "400px" }}
            />
          )}
        </div>
        {!apiCalled &&
        productData != null &&
        productData.prodImage != null &&
        productData.prodImage.length > 0 ? (
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
                        ((productData.retailPrice -
                          productData.discountedPrice) /
                          productData.retailPrice) *
                          100
                      )}
                      % off
                    </Text>
                  </>
                )}
              </div>
              {productData.promotionMessage != null && (
                <Text type="success" strong style={{ fontSize: "14px" }}>
                  Offer: {productData.promotionMessage}
                </Text>
              )}
              <div style={{ margin: "20px 0px" }}>
                <Button
                  type="primary"
                  danger
                  icon={<ShoppingCartOutlined />}
                  size="large"
                  shape="round"
                  style={{ marginRight: "15px" }}
                  onClick={getUserAddToCart}
                >
                  {presentInBag ? "Go to Bag" : "Add to bag"}
                </Button>
                <Button
                  danger
                  icon={wishlisted ? <HeartFilled /> : <HeartOutlined />}
                  size="large"
                  shape="round"
                  onClick={() => pdpWishlistCalled(productData.productName)}
                >
                  {wishlisted ? "Wishlisted" : "Wishlist"}
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
                      <span className="ant-rate-text">
                        {desc[rateValue - 1]}
                      </span>
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
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginTop: "30px",
              marginLeft: "20px",
            }}
          >
            <Skeleton.Input
              active={true}
              style={{ marginTop: "0px", height: "50px", width: "400px" }}
            />
            <Skeleton.Input
              active={true}
              style={{ marginTop: "10px", height: "50px", width: "400px" }}
            />
            <Skeleton.Input
              active={true}
              style={{ marginTop: "10px", height: "150px", width: "400px" }}
            />
            <Skeleton.Input
              active={true}
              style={{ marginTop: "10px", height: "200px", width: "400px" }}
            />
          </div>
        )}
      </div>
      <Divider />
      {similarProd && (
        <div>
          <Title level={3} style={{ textAlign: "left" }}>
            Items you may like
          </Title>
          <div className="pdp_simi_product">
            <SimilarProduct
              categoryId={productData.productCategory}
              productName={productData.productName}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default PDP;
