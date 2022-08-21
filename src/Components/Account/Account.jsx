import React, { useEffect, useContext, useState } from "react";
import { Menu, Card, Typography, message, Result } from "antd";
import "./Account.css";
import deleteAllCookies from "../Util";
import { Link } from "react-router-dom";
import {
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
import { fetchGet } from "./../FetchData";
const { Title } = Typography;
const Account = () => {
  const { isLogin, setisLogin } = useContext(StoreContext);
  const [accountData, setaccountData] = useState({});
  const [apifetch, setapifetch] = useState(false);
  const [selectedKey, setselectedKey] = useState("1");
  const cookies = new Cookies();

  useEffect(() => {
    localStorage.setItem("accountMenuSelected", selectedKey);
  }, [selectedKey]);

  useEffect(() => {
    if (isLogin) {
      getAccount();
    } else {
      deleteAllCookies();
      setisLogin(false);
    }
  }, [isLogin]);

  const getAccount = async () => {
    setapifetch(true);
    try {
      const response = await fetchGet(
        "http://localhost:8090/users/account",
        cookies.get("accessToken")
      );
      setaccountData({ ...response });
    } catch (err) {
      message.error(err.message);
    }
    setapifetch(false);
  };

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
    getItem("My Wishlist", "3", <HeartOutlined />),
    getItem("My Orders", "4", <FileDoneOutlined />),
    getItem("Logout", "5", <LogoutOutlined />),
  ];
  return (
    <div className="account">
      <div className="account_sidenav">
        {!apifetch && Object.keys(accountData).length !== 0 ? (
          <Card style={{ width: 200 }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                }}
              >
                <Title level={4} style={{ margin: "0px" }}>
                  Hello,
                </Title>
                <Title
                  level={5}
                  style={{
                    margin: "0px",
                    width: "150px",
                    textAlign: "left",
                  }}
                  ellipsis={true}
                >
                  {accountData.firstName.toUpperCase()}&nbsp;
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
        {isLogin ? (
          <>
            {!apifetch && Object.keys(accountData).length !== 0 ? (
              <>
                {selectedKey === "1" ? (
                  <ProfileInformation
                    accountData={accountData}
                    setaccountData={setaccountData}
                  />
                ) : null}
                {selectedKey === "2" ? (
                  <ProfileAddress isLogin={isLogin} setisLogin={setisLogin} />
                ) : null}
              </>
            ) : null}
          </>
        ) : (
          <Result
            status="403"
            title="Please login to continue!!!"
            subTitle="Sorry, you are not authorized to access this page."
            extra={<Link to="/">Back Home</Link>}
          />
        )}
      </div>
    </div>
  );
};

export default Account;
