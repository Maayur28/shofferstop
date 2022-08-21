import React, { useState, createContext, useEffect } from "react";
import Cookies from "universal-cookie";
import deleteAllCookies from "../Components/Util";

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
  const [firstName, setfirstName] = useState(cookies.get("firstName"));
  const [windowSize, setWindowSize] = useState(getWindowSize());

  useEffect(() => {
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
      fetch("http://localhost:8090/users", options)
        .then((response) => response.json())
        .then((data) => {
          if (data != null) {
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
      }}
    >
      {props.children}
    </StoreContext.Provider>
  );
};
