import React, { useContext } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import Search from "./../Search/Search";
import Profile from "../Profile/Profile";
import { StoreContext } from "../../Store/data";
const Navbar = () => {
  const { isLogin, firstName, setfirstName, setisLogin } =
    useContext(StoreContext);
  return (
    <div className="navbar">
      <div className="nav__logo">
        <Link to="/">
          <img src="logo.png" alt="logo" />
        </Link>
      </div>
      <div className="nav__search">{<Search />}</div>
      <div className="nav__right">
        {
          <Profile
            isLogin={isLogin}
            firstName={firstName}
            setfirstName={setfirstName}
            setisLogin={setisLogin}
          />
        }
      </div>
    </div>
  );
};

export default Navbar;
