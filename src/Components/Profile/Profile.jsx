import React from "react";
import {
  Dropdown,
  Menu,
  Badge,
  Button,
  Space,
} from "../../../node_modules/antd/lib/index";
import { DownOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import "./Profile.css";

const Profile = () => {
  const menu = (
    <Menu
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
          label: "Login / Signup",
          key: "3",
        },
      ]}
    />
  );
  return (
    <div className="profile">
      <Dropdown overlay={menu}>
        <Button>
          <Space>
            Profile
            <DownOutlined />
          </Space>
        </Button>
      </Dropdown>
      <Link to="#">
        <Badge count={5} size="small" style={{ margin: "0px 20px" }}>
          <ShoppingCartOutlined style={{ fontSize: 20, margin: "0px 20px" }} />
        </Badge>
      </Link>
    </div>
  );
};

export default Profile;
