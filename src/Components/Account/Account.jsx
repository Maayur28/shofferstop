import React from "react";
import { Menu, Card, Avatar, Typography } from "antd";
import "./Account.css";
import {
  DollarOutlined,
  BookOutlined,
  UserOutlined,
  HeartOutlined,
  LogoutOutlined,
  FileDoneOutlined,
} from "@ant-design/icons";
import Cookies from "universal-cookie";
import ProfileInformation from "./ProfileInformation/ProfileInformation";
const { Title } = Typography;
const Account = () => {
  const cookies = new Cookies();
  const firstName = cookies.get("firstName");

  function getItem(label, key, icon, children, type) {
    return {
      key,
      icon,
      children,
      label,
      type,
    };
  }
  const items = [
    getItem("Profile Information", "1", <UserOutlined />),
    getItem("Manage Address", "2", <BookOutlined />),
    getItem("Payment Options", "3", <DollarOutlined />),
    getItem("My Wishlist", "4", <HeartOutlined />),
    getItem("My Orders", "5", <FileDoneOutlined />),
    getItem("Logout", "6", <LogoutOutlined />),
  ];
  return (
    <div className="account">
      <div className="account_sidenav">
        <Card style={{ width: 200 }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <Avatar
              size="large"
              style={{
                backgroundColor: "#87d068",
                marginRight: "10px",
              }}
            >
              {firstName.charAt(0).toUpperCase()}
            </Avatar>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
              }}
            >
              <Title level={5} style={{ margin: "0px" }}>
                Hello,
              </Title>
              <Title level={3} style={{ margin: "0px" }}>
                {firstName.toUpperCase()}
              </Title>
            </div>
          </div>
        </Card>
        <div style={{ width: 200 }}>
          <Menu defaultSelectedKeys={["1"]} mode="inline" items={items} />
        </div>
      </div>
      <div className="account_content">
        <ProfileInformation />
      </div>
    </div>
  );
};

export default Account;
