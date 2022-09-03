import React from "react";
import { Typography } from "antd";
const { Text } = Typography;
const OrderItemHeading = ({ date, price, fullName, accountCall }) => {
  return (
    <div className="orderItemheading">
      <div
        style={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Text type="secondary">Order Placed</Text> <Text strong>{date}</Text>
      </div>
      <div
        style={{ display: "flex", flexDirection: "column", margin: "0px 50px" }}
      >
        <Text type="secondary">Order Total</Text>
        <Text type="success" strong>
          ₹{price}
        </Text>
      </div>
      {!accountCall && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            margin: "0px 50px",
          }}
        >
          <Text type="secondary">Ship to</Text>
          <Text strong>{fullName}</Text>
        </div>
      )}
    </div>
  );
};

export default OrderItemHeading;
