import React, { useState } from "react";
import { Dropdown, Menu, Badge, Button, Space } from "antd";
import {
  DownOutlined,
  ShoppingCartOutlined,
  LoginOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import "./Profile.css";
import Login from "../Login/Login";
import Cookies from "universal-cookie";

const Profile = () => {
  const cookies = new Cookies();
  const name = useState(
    cookies.get("firstName") == null
      ? "Login/Register"
      : cookies.get("firstName")
  );
  const [loginModalVisible, setloginModalVisible] = useState(false);
  const handleMenuClick = (e) => {
    if (e.key === "2") {
      setloginModalVisible((prev) => !prev);
    }
  };
  const menu = (
    <Menu
      onClick={handleMenuClick}
      items={[
        {
          label: (
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://www.antgroup.com"
            >
              My Account
            </a>
          ),
          key: "0",
        },
        {
          label: (
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://www.aliyun.com"
            >
              Wishlist
            </a>
          ),
          key: "1",
        },
        {
          type: "divider",
        },
        {
          label:
            name === "Login/Register" ? (
              <Button type="primary" icon={<LoginOutlined />}>
                Login/Register
              </Button>
            ) : (
              <Button type="primary" icon={<LogoutOutlined />}>
                Logout
              </Button>
            ),
          key: "2",
        },
      ]}
    />
  );
  return (
    <>
      <div className="profile">
        <Dropdown overlay={menu}>
          <Button>
            <Space>
              {name}
              <DownOutlined />
            </Space>
          </Button>
        </Dropdown>
        <Link to="#">
          <Badge count={5} size="small" style={{ margin: "0px 20px" }}>
            <ShoppingCartOutlined
              style={{ fontSize: 20, margin: "0px 20px" }}
            />
          </Badge>
        </Link>
      </div>
      <Login
        loginModalVisible={loginModalVisible}
        loginModalCall={(prev) => setloginModalVisible(!prev)}
      />
    </>
  );
};

export default Profile;
