import React, { useState, createContext, useEffect } from "react";
import Cookies from "universal-cookie";
import deleteAllCookies from "../Components/Util";
import { fetchGet } from "../Components/FetchData";

export const StoreContext = createContext({});
const cookies = new Cookies();
export const StoreProvider = (props) => {
  const [isLogin, setisLogin] = useState(
    cookies.get("firstName") != null &&
      cookies.get("accessToken") != null &&
      cookies.get("refreshToken") != null
      ? true
      : false
  );
  const [cartCount, setCartCount] = useState(0);
  const [firstName, setfirstName] = useState(cookies.get("firstName"));
  const [windowSize, setWindowSize] = useState(getWindowSize());
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    let promo = JSON.parse(localStorage.getItem("homePage"));
    const current = new Date();
    const date = `${
      current.getFullYear() < 10
        ? `0${current.getFullYear()}`
        : current.getFullYear()
    }-${
      current.getMonth() + 1 < 10
        ? `0${current.getMonth() + 1}`
        : current.getMonth() + 1
    }-${current.getDate() < 10 ? `0${current.getDate()}` : current.getDate()}`;
    if (promo === null || date !== promo.date) {
      localStorage.removeItem("homePage");
    }
    function handleWindowResize() {
      setWindowSize(getWindowSize());
    }
    window.addEventListener("resize", handleWindowResize);
    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);

  useEffect(() => {
    if (isLogin) {
      const options = {
        method: "GET",
        headers: {
          Authorization: `Bearer ${cookies.get("accessToken")}`,
        },
      };
      fetch("https://shofferstopuserservice.up.railway.app/users", options)
        .then((response) => response.json())
        .then((data) => {
          if (data != null) {
            setUserId(data.userId);
            setfirstName(cookies.get("firstName"));
            setisLogin(true);
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
  }, [isLogin]);

  useEffect(() => {
    if (isLogin) {
      if (userId != null && userId !== undefined) getUserId();
    } else {
      setCartCount(0);
      deleteAllCookies();
      setisLogin(false);
    }
  }, [isLogin, userId]); // eslint-disable-line react-hooks/exhaustive-deps

  const getUserId = async () => {
    const response = await fetchGet(
      `https://shofferstopprodservice.up.railway.app/cart/count/${userId}`,
      ""
    );
    setCartCount(response);
  };

  function getWindowSize() {
    const { innerWidth, innerHeight } = window;
    return { innerWidth, innerHeight };
  }
  return (
    <StoreContext.Provider
      value={{
        isLogin: isLogin,
        setisLogin: setisLogin,
        window: windowSize,
        firstName: firstName,
        setfirstName: setfirstName,
        cartCount: cartCount,
        setCartCount: setCartCount,
        userId: userId,
        setUserId: setUserId,
      }}
    >
      {props.children}
    </StoreContext.Provider>
  );
};
