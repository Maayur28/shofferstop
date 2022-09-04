import React, { useEffect, useState, useContext } from "react";
import { StoreContext } from "../../Store/data";
import { fetchDelete, fetchGet, fetchPost, fetchPut } from "../FetchData";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import {
  message,
  Card,
  Result,
  Typography,
  Divider,
  Badge,
  Select,
  Skeleton,
  Image,
  Spin,
  Steps,
  Button,
} from "antd";
import { CloseOutlined } from "@ant-design/icons";
import deleteAllCookies from "../Util";
import "./Cart.css";
import ProfileAddress from "../Account/ProfileAddress/ProfileAddress";
import OrderSummary from "./OrderSummary";

const { Title, Text } = Typography;
const { Option } = Select;
const { Step } = Steps;

const Cart = () => {
  const { isLogin, setisLogin, setCartCount, userId } =
    useContext(StoreContext);
  let navigate = useNavigate();
  const [apiCalled, setapiCalled] = useState(false);
  const [cartUpdateCalled, setCartUpdateCalled] = useState(false);
  const [cartData, setCartData] = useState({});
  const [current, setCurrent] = useState(0);
  const [orderCalled, setOrderCalled] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState(0);

  const [defaultAddress, setDefaultAddress] = useState({});
  useEffect(() => {
    if (isLogin) {
      if (userId !== undefined && userId != null) getCart();
    } else {
      deleteAllCookies();
      setisLogin(false);
    }
  }, [isLogin, userId]); // eslint-disable-line react-hooks/exhaustive-deps

  const getCart = async () => {
    setapiCalled(true);
    try {
      const response = await fetchGet(
        `https://shofferstop-prodservice.herokuapp.com/cart/${userId}`
      );
      setCartData({ ...response });
      if (
        response === null ||
        response.items == null ||
        response.items === undefined
      ) {
        setCartCount(0);
      } else {
        setCartCount(response.items.length);
      }
    } catch (err) {
      message.error("Please try again later");
    }
    setapiCalled(false);
  };

  const quantityOptions = [];
  for (let i = 1; i <= 5; i++) {
    quantityOptions.push(
      <Option key={i + "q"} value={i}>
        {i}
      </Option>
    );
  }

  const handleQuantityChange = async (productName, value) => {
    if (isLogin) {
      setCartUpdateCalled(true);
      try {
        let values = {};
        values.productName = productName;
        values.productQuantity = value;
        const response = await fetchPut(
          `https://shofferstop-prodservice.herokuapp.com/cart/${userId}`,
          values
        );
        setCartData({ ...response });
        message.success("Quantity updated");
      } catch (err) {
        message.error("Please try again later");
      }
      setCartUpdateCalled(false);
    } else {
      deleteAllCookies();
      setisLogin(false);
    }
  };

  const deleteProd = async (productName) => {
    if (userId && productName) {
      setCartUpdateCalled(true);
      try {
        const response = await fetchDelete(
          `https://shofferstop-prodservice.herokuapp.com/cart/${userId}?` +
            new URLSearchParams({
              productName: productName,
            })
        );
        setCartData({ ...response });
        if (response.items != null && response.items !== undefined) {
          setCartCount(response.items.length);
        } else setCartCount(0);
        message.success("Product has been removed");
      } catch (err) {
        message.error("Please try again later");
      }
      setCartUpdateCalled(false);
    } else {
      deleteAllCookies();
      setisLogin(false);
    }
  };

  const placeOrder = async () => {
    if (current === 2 && userId != null && userId !== undefined) {
      setOrderCalled(true);
      let values = {};
      values.address = defaultAddress;
      values.cart = cartData;
      const response = await fetchPost(
        `https://shofferstop-prodservice.herokuapp.com/cart/order/${userId}`,
        values
      );
      if (response) {
        setCartData({});
        setDefaultAddress({});
        setCartCount(0);
        setOrderCalled(false);
        setOrderId(response);
        setCurrent(0);
        setOrderPlaced(true);
      } else {
        setOrderId(0);
        message.error("Problem occured!!!");
      }
    } else {
      setCurrent(current + 1);
    }
  };

  return (
    <div className="cart_div">
      {orderPlaced && isLogin && orderId !== 0 ? (
        <div className="orderConfirmed">
          <Result
            status="success"
            title="Order Placed Successfully"
            subTitle="We have sent the order confirmation over your registered mail"
            extra={[
              <Button type="primary" key="home" onClick={() => navigate("/")}>
                Buy More
              </Button>,
              <Button key="orders" onClick={() => navigate("/order")}>
                View Orders
              </Button>,
            ]}
          />
        </div>
      ) : (
        <>
          {isLogin ? (
            <>
              {orderCalled ? (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "98vw",
                    height: "80vh",
                  }}
                >
                  <Image
                    width="75vw"
                    height="75vh"
                    src="/orderConfirmation.gif"
                    preview={false}
                  />
                </div>
              ) : (
                <>
                  {!apiCalled ? (
                    <>
                      {!cartUpdateCalled ? (
                        <>
                          {cartData != null &&
                            cartData !== undefined &&
                            cartData.items !== undefined &&
                            cartData.items !== null &&
                            cartData.items.length > 0 && (
                              <div
                                style={{
                                  display: "flex",
                                  width: "98vw",
                                  justifyContent: "center",
                                  marginBottom: "10px",
                                }}
                              >
                                <Steps
                                  type="navigation"
                                  size="small"
                                  current={current}
                                  onChange={setCurrent}
                                  className="site-navigation-steps"
                                >
                                  <Step
                                    status={
                                      current === 0 ? "process" : "finish"
                                    }
                                    title="Bag"
                                  />
                                  <Step
                                    status={
                                      current === 1
                                        ? "process"
                                        : current === 0
                                        ? "wait"
                                        : "finish"
                                    }
                                    disabled={current < 1}
                                    title="Address"
                                  />
                                  <Step
                                    status={current === 2 ? "process" : "wait"}
                                    title="Place Order"
                                    disabled={current < 2}
                                  />
                                </Steps>
                              </div>
                            )}
                          {cartData != null &&
                          cartData !== undefined &&
                          cartData.items !== undefined &&
                          cartData.items !== null &&
                          cartData.items.length > 0 ? (
                            <div className="cart">
                              {current === 0 ? (
                                <div className="cart_products">
                                  {cartData.items.map((productData, index) => (
                                    <Card
                                      hoverable
                                      key={index}
                                      className="cart_card_prod"
                                      bodyStyle={{ display: "flex" }}
                                    >
                                      <div className="cart_quantity">
                                        <div className="cart_product_image">
                                          <Image
                                            width={120}
                                            height={120}
                                            src={productData.productImage}
                                            fallback="/image_not_available.png"
                                          />
                                        </div>
                                        <div id="qty_selectDiv">
                                          <span className="qty_selectDiv_text">
                                            Qty:&nbsp;
                                          </span>
                                          <Select
                                            defaultValue={
                                              productData.productQuantity
                                            }
                                            onChange={(value) =>
                                              handleQuantityChange(
                                                productData.productName,
                                                value
                                              )
                                            }
                                            style={{
                                              width: 80,
                                            }}
                                          >
                                            {quantityOptions}
                                          </Select>
                                        </div>
                                      </div>
                                      <div className="cart_card_remove">
                                        <CloseOutlined
                                          className="card_remove"
                                          onClick={() => {
                                            deleteProd(productData.productName);
                                          }}
                                        />
                                      </div>
                                      <div
                                        className="cart_product_detail"
                                        onClick={() =>
                                          navigate(
                                            `/product/${productData.productName}`
                                          )
                                        }
                                      >
                                        <Title level={3} style={{}}>
                                          {productData.productBrand}
                                        </Title>
                                        <Text
                                          type="secondary"
                                          style={{ fontSize: "20px" }}
                                        >
                                          {productData.productName}
                                        </Text>
                                        <div style={{}}>
                                          <Text
                                            strong
                                            style={{
                                              fontSize: "20px",
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
                                                  fontSize: "18px",
                                                  marginRight: "5px",
                                                }}
                                              >
                                                ₹{productData.retailPrice}
                                              </Text>
                                              <Text
                                                type="success"
                                                strong
                                                style={{ fontSize: "18px" }}
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
                                        {productData.promotionMessage !=
                                          null && (
                                          <Text
                                            type="success"
                                            strong
                                            style={{ fontSize: "14px" }}
                                          >
                                            Offer:{" "}
                                            {productData.promotionMessage}
                                          </Text>
                                        )}
                                      </div>
                                    </Card>
                                  ))}
                                  {cartData.gifts != null &&
                                    cartData.gifts !== undefined &&
                                    cartData.gifts.length > 0 && (
                                      <div style={{ textAlign: "left" }}>
                                        <Divider />
                                        <Text
                                          strong
                                          type="success"
                                          style={{ fontSize: "20px" }}
                                        >
                                          Free Gifts
                                        </Text>
                                        <div
                                          className="cart_gifts"
                                          style={{ marginTop: "20px" }}
                                        >
                                          {cartData.gifts.map(
                                            (productData, index) => (
                                              <Card
                                                key={index + "0"}
                                                className="cart_card_prod"
                                                bodyStyle={{ display: "flex" }}
                                              >
                                                <div className="cart_product_image">
                                                  <Image
                                                    width={120}
                                                    height={120}
                                                    src={
                                                      productData.productImage
                                                    }
                                                    preview={false}
                                                    fallback="/image_not_available.png"
                                                  />
                                                </div>
                                                <div className="cart_product_detail">
                                                  <Title level={4} style={{}}>
                                                    {productData.productBrand}
                                                  </Title>
                                                  <Text
                                                    type="secondary"
                                                    style={{ fontSize: "16px" }}
                                                  >
                                                    {productData.productName}
                                                  </Text>
                                                  <div>
                                                    <Text>Qty:&nbsp;</Text>
                                                    <Badge
                                                      count={
                                                        productData.productQuantity
                                                      }
                                                    />
                                                  </div>
                                                </div>
                                              </Card>
                                            )
                                          )}
                                        </div>
                                      </div>
                                    )}
                                </div>
                              ) : (
                                <>
                                  {current === 1 ? (
                                    <div className="cart_address">
                                      <Title level={4}>
                                        Select Delivery Address
                                      </Title>
                                      <ProfileAddress
                                        isLogin={isLogin}
                                        setisLogin={setisLogin}
                                        defaultAddress={defaultAddress}
                                        setDefaultAddress={setDefaultAddress}
                                      />
                                    </div>
                                  ) : (
                                    <div className="cart_orderSummary">
                                      <Title level={4}>Order Summary</Title>
                                      <Divider />
                                      <OrderSummary
                                        defaultAddress={defaultAddress}
                                        cartData={cartData}
                                      />
                                    </div>
                                  )}
                                </>
                              )}
                              <div className="cart_price">
                                <Card
                                  title="Price Details"
                                  className="cart_card_price"
                                >
                                  <div
                                    style={{
                                      display: "flex",
                                      justifyContent: "space-between",
                                    }}
                                  >
                                    <Text>Total MRP</Text>
                                    <Text>₹{cartData.totalBeforeDiscount}</Text>
                                  </div>
                                  <div
                                    style={{
                                      display: "flex",
                                      justifyContent: "space-between",
                                    }}
                                  >
                                    <Text>Discount on MRP</Text>
                                    <Text strong type="success">
                                      -₹{cartData.totalDiscount}
                                    </Text>
                                  </div>
                                  <Divider />
                                  <div
                                    style={{
                                      display: "flex",
                                      justifyContent: "space-between",
                                    }}
                                  >
                                    <Text strong style={{ fontSize: "16px" }}>
                                      Total Amount
                                    </Text>
                                    <Text strong style={{ fontSize: "16px" }}>
                                      ₹{cartData.totalAfterDiscount}
                                    </Text>
                                  </div>
                                  <Divider />
                                  <div>
                                    <Button
                                      type="primary"
                                      danger
                                      block
                                      onClick={placeOrder}
                                    >
                                      {current === 0
                                        ? "Select Address"
                                        : current === 1
                                        ? "Continue"
                                        : "Place Order"}
                                    </Button>
                                    {current === 1 && (
                                      <div style={{ textAlign: "left" }}>
                                        <Text type="warning">
                                          Default address is your delivery
                                          address
                                        </Text>
                                      </div>
                                    )}
                                  </div>
                                </Card>
                              </div>
                            </div>
                          ) : (
                            <Image
                              style={{ cursor: "pointer" }}
                              onClick={() => navigate("/")}
                              width="80vw"
                              height="80vh"
                              src="/cartEmpty.jpg"
                              preview={false}
                            />
                          )}
                        </>
                      ) : (
                        <Spin tip="Loading..."></Spin>
                      )}
                    </>
                  ) : (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          flexWrap: "wrap",
                          alignItems: "center",
                          marginRight: "20px",
                        }}
                      >
                        <Skeleton.Input
                          active={true}
                          style={{
                            marginTop: "0px",
                            height: "200px",
                            width: "800px",
                            minWidth: "300px",
                            marginBottom: "10px",
                          }}
                        />
                        <Skeleton.Input
                          active={true}
                          style={{
                            marginTop: "0px",
                            height: "200px",
                            width: "800px",
                            minWidth: "300px",
                            marginBottom: "10px",
                          }}
                        />
                        <Skeleton.Input
                          active={true}
                          style={{
                            marginTop: "0px",
                            height: "200px",
                            width: "800px",
                            minWidth: "300px",
                          }}
                        />
                      </div>
                      <div>
                        <Skeleton.Input
                          active={true}
                          style={{
                            marginTop: "0px",
                            height: "200px",
                            width: "300px",
                          }}
                        />
                      </div>
                    </div>
                  )}
                </>
              )}
            </>
          ) : (
            <Result
              status="403"
              title="Please login to view cart!!!"
              subTitle="Sorry, you are not authorized to access this page."
              extra={<Link to="/">Back Home</Link>}
            />
          )}
        </>
      )}
    </div>
  );
};

export default Cart;
