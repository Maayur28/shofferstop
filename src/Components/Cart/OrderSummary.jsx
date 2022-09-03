import React from "react";
import AddressCard from "../Account/ProfileAddress/AddressCard";
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

const { Title, Text } = Typography;

const OrderSummary = ({ defaultAddress, cartData }) => {
  console.log(defaultAddress, cartData);
  return (
    <div className="cart_orderSummary">
      <Title style={{ textAlign: "left" }} level={4}>
        Delivery Address
      </Title>
      <div className="cart_orderSummary_deliveryAddress">
        <AddressCard val={defaultAddress} />
      </div>
      <Divider />
      <Title style={{ textAlign: "left" }} level={4}>
        Items
      </Title>
      <div className="cart_orderSummary_items">
        <div className="cart_products" style={{ width: "100%" }}>
          {cartData.items.map((productData, index) => (
            <Card
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
                    preview={false}
                    fallback="/image_not_available.png"
                  />
                </div>
                <div>
                  <Text>Qty:&nbsp;</Text>
                  <Text strong style={{ fontSize: "16px" }}>
                    {productData.productQuantity}
                  </Text>
                </div>
              </div>
              <div className="cart_product_detail">
                <Title level={3} style={{}}>
                  {productData.productBrand}
                </Title>
                <Text type="secondary" style={{ fontSize: "20px" }}>
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
                  {productData.discountedPrice !== productData.retailPrice && (
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
              </div>
            </Card>
          ))}
          {cartData.gifts != null &&
            cartData.gifts !== undefined &&
            cartData.gifts.length > 0 && (
              <div style={{ textAlign: "left" }}>
                <Divider />
                <Text strong type="success" style={{ fontSize: "20px" }}>
                  Free Gifts
                </Text>
                <div className="cart_gifts" style={{ marginTop: "20px" }}>
                  {cartData.gifts.map((productData, index) => (
                    <Card
                      key={index + "0"}
                      className="cart_card_prod"
                      bodyStyle={{ display: "flex" }}
                    >
                      <div className="cart_product_image">
                        <Image
                          width={120}
                          height={120}
                          src={productData.productImage}
                          preview={false}
                          fallback="/image_not_available.png"
                        />
                      </div>
                      <div className="cart_product_detail">
                        <Title level={4} style={{}}>
                          {productData.productBrand}
                        </Title>
                        <Text type="secondary" style={{ fontSize: "16px" }}>
                          {productData.productName}
                        </Text>
                        <div>
                          <Text>Qty:&nbsp;</Text>
                          <Text strong style={{ fontSize: "16px" }}>
                            {productData.productQuantity}
                          </Text>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
