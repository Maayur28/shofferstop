import React, { useState } from "react";
import { Card, Typography, Image, Skeleton } from "antd";
import ReactSimplyCarousel from "react-simply-carousel";
import { RightSquareOutlined, LeftSquareOutlined } from "@ant-design/icons";
const { Text, Title, Paragraph } = Typography;
const { Meta } = Card;
const AtProd = ({ prod, title, pdpCalled }) => {
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  return (
    <Card
      title={<Title level={4}>{title}</Title>}
      style={{ textAlign: "left", fontSize: "24px" }}
    >
      <ReactSimplyCarousel
        activeSlideIndex={activeSlideIndex}
        onRequestChange={setActiveSlideIndex}
        itemsToShow={1}
        itemsToScroll={1}
        forwardBtnProps={{
          style: {
            alignSelf: "center",
            background: "transparent",
            border: "none",
            borderRadius: "50%",
            color: "#1890FF",
            cursor: "pointer",
            fontSize: "50px",
            height: 50,
            lineHeight: 1,
            textAlign: "center",
            width: 50,
          },
          children: <RightSquareOutlined />,
        }}
        backwardBtnProps={{
          style: {
            alignSelf: "center",
            background: "transparent",
            border: "none",
            borderRadius: "50%",
            color: "#1890FF",
            cursor: "pointer",
            fontSize: "50px",
            height: 50,
            lineHeight: 1,
            textAlign: "center",
            width: 60,
          },
          children: <LeftSquareOutlined />,
        }}
        responsiveProps={[
          {
            itemsToShow: 5,
            itemsToScroll: 1,
            width: "100%",
          },
        ]}
        speed={400}
        easing="linear"
      >
        {prod.length > 0 ? (
          prod.map((val, index) => (
            <Card
              key={val.id}
              hoverable
              className="card_similar_product"
              style={{ textAlign: "center" }}
              onClick={() => pdpCalled(val.productName)}
              cover={
                <Image
                  alt={val.productName}
                  src={val.prodImage}
                  style={{
                    padding: "25px 25px",
                    width: "100%",
                    height: "200px",
                  }}
                  fallback="/image_not_available.png"
                  preview={false}
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
      </ReactSimplyCarousel>
    </Card>
  );
};

export default AtProd;
