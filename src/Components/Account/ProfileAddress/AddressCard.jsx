import React from "react";
import { Card, Typography, Button, Divider } from "antd";

const { Title, Paragraph, Text } = Typography;
const AddressCard = ({ val, setAsDefault, setaddressEditMode ,deleteAddressCalled}) => {
  return (
    <Card
      className="profile_show_address"
      key={val.addressId}
      bodyStyle={{ paddingBottom: "0px" }}
    >
      {
        <>
          <div style={{ textAlign: "left" }}>
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                justifyContent: "space-between",
              }}
            >
              <Title level={4}>{val.fullName}</Title>
              {val.defaultAddress === 0 && (
                <Text
                  type="success"
                  style={{ cursor: "pointer" }}
                  strong
                  onClick={() => setAsDefault(val.addressId)}
                >
                  Set as default
                </Text>
              )}
            </div>
            <Paragraph
              ellipsis={
                true ? { rows: 2, expandable: true, symbol: "more" } : false
              }
            >
              {val.houseAddress}
            </Paragraph>
            <Text>
              {val.city} - {val.pincode}
            </Text>
            <br />
            <Text>
              {val.state} , {val.country}
            </Text>
            <br />
            <Text strong>Mobile: {val.mobile}</Text>
          </div>
          <Divider className="address_card_divider" />
          {val.defaultAddress === 0 && (
            <div>
              <Button
                type="text"
                className="address_card_button"
                onClick={setaddressEditMode}
              >
                Edit
              </Button>
              <Divider
                type="vertical"
                className="address_card_divider_vertical"
              />
              <Button type="text" className="address_card_button" onClick={deleteAddressCalled}>
                Remove
              </Button>
            </div>
          )}
        </>
      }
    </Card>
  );
};

export default AddressCard;
