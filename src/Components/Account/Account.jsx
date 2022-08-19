import React, { useEffect, useContext, useState } from "react";
import { Menu, Card, Avatar, Typography } from "antd";
import "./Account.css";
import deleteAllCookies from "../Util";
import {
  DollarOutlined,
  BookOutlined,
  UserOutlined,
  HeartOutlined,
  LogoutOutlined,
  FileDoneOutlined,
} from "@ant-design/icons";
import { StoreContext } from "../../Store/data";
import Cookies from "universal-cookie";
import ProfileInformation from "./ProfileInformation/ProfileInformation";
import ProfileAddress from "./ProfileAddress/ProfileAddress";
const { Title } = Typography;
const Account = () => {
  const { isLogin, setisLogin } = useContext(StoreContext);
  const [accountData, setaccountData] = useState({});
  const [apifetch, setapifetch] = useState(false);
  const [selectedKey, setselectedKey] = useState("1");
  const cookies = new Cookies();

  useEffect(() => {
    if (isLogin) {
      setapifetch(true);
      const options = {
        method: "GET",
        headers: {
          Authorization: `Bearer ${cookies.get("accessToken")}`,
        },
      };
      fetch("http://localhost:8090/users/account", options)
        .then((response) => response.json())
        .then((data) => {
          if (data != null) {
            console.log(data);
            setaccountData({ ...data });
          } else {
            deleteAllCookies();
            setisLogin(false);
          }
        })
        .catch(() => {
          deleteAllCookies();
          setisLogin(false);
        });
    } else {
      deleteAllCookies();
      setisLogin(false);
    }
    setapifetch(false);
  }, []);

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
        {!apifetch && Object.keys(accountData).length !== 0 ? (
          <Card style={{ width: 200 }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <Avatar
                size="large"
                style={{
                  backgroundColor: "#87d068",
                  marginRight: "10px",
                }}
              >
                {accountData.firstName.charAt(0).toUpperCase()}
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
                  {accountData.firstName.toUpperCase()}
                  {accountData.lastName != null &&
                    accountData.lastName.toUpperCase()}
                </Title>
              </div>
            </div>
          </Card>
        ) : null}
        <div style={{ width: 200 }}>
          <Menu
            defaultSelectedKeys={[selectedKey]}
            mode="inline"
            items={items}
            onClick={(e) => setselectedKey(e.key)}
          />
        </div>
      </div>
      <div className="account_content">
        {!apifetch && Object.keys(accountData).length !== 0 ? (
          <>
            {selectedKey === "1" ? (
              <ProfileInformation accountData={accountData} />
            ) : null}
            {selectedKey === "2" ? (
              <ProfileAddress accountData={accountData.addresses} />
            ) : null}
          </>
        ) : null}
      </div>
    </div>
  );
};

export default Account;
