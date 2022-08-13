import React, { useState, createContext, useEffect } from "react";
export const StoreContext = createContext({});
export const StoreProvider = (props) => {
  const [isLogin, setisLogin] = useState(false);
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

  function getWindowSize() {
    const { innerWidth, innerHeight } = window;
    return { innerWidth, innerHeight };
  }
  return (
    <StoreContext.Provider
      value={{
        login: [isLogin, setisLogin],
        window: windowSize,
      }}
    >
      {props.children}
    </StoreContext.Provider>
  );
};
