import React from "react";
import { Carousel, Row, Col, Card, Typography } from "antd";
const { Title } = Typography;
const contentStyle = {
  height: "60vh",
  color: "#fff",
  lineHeight: "60vh",
  textAlign: "center",
  background: "#364d79",
};

const HomePage = () => {
  return (
    <div className="homePage">
      <div className="carousel">
        <Carousel autoplay>
          <div>
            <h3 style={contentStyle}>1</h3>
          </div>
          <div>
            <h3 style={contentStyle}>2</h3>
          </div>
          <div>
            <h3 style={contentStyle}>3</h3>
          </div>
          <div>
            <h3 style={contentStyle}>4</h3>
          </div>
        </Carousel>
      </div>
      <div className="site-card-wrapper">
        <Row gutter={24}>
          <Col span={8}>
            <Card title="Deal of the day" bordered={false}>
              Deal of the day
            </Card>
          </Col>
          <Col span={8}>
            <Card title="At ₹99" bordered={false}>
              At ₹99
            </Card>
          </Col>
          <Col span={8}>
            <Card title="Category under offer" bordered={false}>
              Category under offer
            </Card>
          </Col>
        </Row>
      </div>
      <div className="browsingHistory">
        <Title level={2} style={{ float: "left" }}>
          Your browsing history
        </Title>
      </div>
    </div>
  );
};

export default HomePage;
