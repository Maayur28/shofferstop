import React, { useState } from "react";
import { Dropdown, Menu, Badge, Button, Space, Avatar } from "antd";
import {
  DownOutlined,
  ShoppingCartOutlined,
  LoginOutlined,
  UserOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import "./Profile.css";
import Login from "../Login/Login";
import deleteAllCookies from "../Util";

const Profile = ({ isLogin, firstName, setfirstName, setisLogin }) => {
  const [loginModalVisible, setloginModalVisible] = useState(false);
  const handleMenuClick = (e) => {
    if (e.key === "2" && e.domEvent.target.innerText !== "Logout") {
      setloginModalVisible((prev) => !prev);
    } else if (e.key === "2" && e.domEvent.target.innerText === "Logout") {
      deleteAllCookies();
      setfirstName("");
      setisLogin(false);
    }
  };
  const menu = (
    <Menu
      onClick={handleMenuClick}
      items={[
        {
          label: <Link to="/account">My Account</Link>,
          key: "0",
          disabled: !isLogin,
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
          disabled: !isLogin,
          key: "1",
        },
        {
          type: "divider",
        },
        {
          label: !isLogin ? (
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
          <span style={{ cursor: "pointer" }}>
            <Space>
              {isLogin ? (
                <div>
                  <Avatar size="small" style={{ backgroundColor: "#87d068" }}>
                    {firstName.charAt(0).toUpperCase()}
                  </Avatar>
                  <span style={{ marginLeft: "5px" }}>{firstName}</span>
                </div>
              ) : (
                <div>
                  <Avatar size="small" icon={<UserOutlined />} />
                  <span style={{ marginLeft: "5px" }}>login</span>
                </div>
              )}
              <DownOutlined />
            </Space>
          </span>
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
        setloginModalVisible={setloginModalVisible}
        setfirstName={setfirstName}
      />
    </>
  );
};

export default Profile;
