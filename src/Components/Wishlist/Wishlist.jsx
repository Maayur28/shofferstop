import React, { useEffect, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Image, Card, Typography, Skeleton, message } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { fetchDelete, fetchGet, fetchPost } from "../FetchData";
import { StoreContext } from "./../../Store/data";
import deleteAllCookies from "./../Util";
import Cookies from "universal-cookie";

const { Title, Text, Paragraph } = Typography;

const Wishlist = () => {
  let navigate = useNavigate();
  const [apiCalled, setapiCalled] = useState(false);
  const { isLogin, setisLogin } = useContext(StoreContext);
  const [wishlistProduct, setWishlistProduct] = useState([]);
  const cookies = new Cookies();
  useEffect(() => {
    if (
      isLogin &&
      cookies.get("accessToken") != null &&
      cookies.get("accessToken") !== undefined
    ) {
      getWishlistProdName();
    } else {
      deleteAllCookies();
      setisLogin(false);
    }
  }, [isLogin]); // eslint-disable-line react-hooks/exhaustive-deps

  const getWishlistProdName = async () => {
    setapiCalled(true);
    const response = await fetchGet(
      `https://shofferstopuserservice.azurewebsites.net/users/wishlist`,
      cookies.get("accessToken")
    );
    getWishlist(response);
  };

  const deleteWishlist = async (productName) => {
    setapiCalled(true);
    const response = await fetchDelete(
      `https://shofferstopuserservice.azurewebsites.net/users/wishlist/${productName}`,
      cookies.get("accessToken")
    );
    message.success("Wishlist Updated");
    getWishlist(response);
  };

  const getWishlist = async (prod) => {
    const response = await fetchPost(
      "https://shofferstopprodservice.azurewebsites.net/product/wishlist",
      prod
    );
    if (response && response.products) {
      setWishlistProduct(constructProd(response.products));
    }
    setapiCalled(false);
  };

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
          console.log(images[0]);
          val.prodImage = images[0].substring(1, images[0].length - 1);
        }
      });
    }
    return products;
  };

  return (
    <>
      <Title style={{ color: "red", fontSize: "20px" }}>Your Wishlist</Title>
      {!apiCalled ? (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
          }}
        >
          {wishlistProduct != null && wishlistProduct.length > 0 ? (
            wishlistProduct.map((productData, index) => (
              <Card
                hoverable
                key={index}
                style={{
                  width: "250px",
                  display: "flex",
                  marginBottom: "10px",
                }}
                className="account_wishlist_card"
                bodyStyle={{ display: "flex", width: "250px" }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <div className="cart_product_image">
                    <Image
                      width={120}
                      height={100}
                      src={productData.prodImage}
                      fallback="/image_not_available.png"
                    />
                  </div>
                  <div
                    className="account_wishlist_detail"
                    style={{ marginTop: "10px" }}
                    onClick={() =>
                      navigate(`/product/${productData.productName}`)
                    }
                  >
                    <Title level={4}>{productData.prodBrand}</Title>
                    <Paragraph
                      style={true ? { width: 200 } : undefined}
                      ellipsis={true}
                    >
                      {productData.productName}
                    </Paragraph>
                    <div>
                      <Text
                        strong
                        style={{
                          fontSize: "16px",
                          marginRight: "5px",
                        }}
                      >
                        ₹{productData.discountedPrice}
                      </Text>
                      {productData.discountedPrice !==
                        productData.retailPrice && (
                        <>
                          <Text
                            delete
                            type="secondary"
                            style={{
                              fontSize: "14px",
                              marginRight: "5px",
                            }}
                          >
                            ₹{productData.retailPrice}
                          </Text>
                          <Text
                            type="success"
                            strong
                            style={{ fontSize: "14px" }}
                          >
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
                      <Text type="success" strong style={{ fontSize: "12px" }}>
                        Offer: {productData.promotionMessage}
                      </Text>
                    )}
                  </div>
                </div>
                <div className="cart_card_remove">
                  <CloseOutlined
                    className="card_remove"
                    onClick={() => {
                      deleteWishlist(productData.productName);
                    }}
                  />
                </div>
              </Card>
            ))
          ) : (
            <Image
              width="400px"
              height="400px"
              src="/wishlistEmpty.png"
              preview={false}
            />
          )}
        </div>
      ) : (
        <div style={{ display: "flex", flexWrap: "wrap" }}>
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
    </>
  );
};

export default Wishlist;
