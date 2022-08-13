import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import Search from "./../Search/Search";
import Profile from "../Profile/Profile";
const Navbar = () => {
  return (
    <div className="navbar">
      <div className="nav__logo">
        <Link to="/">
          <img src="logo.png" alt="logo" />
        </Link>
      </div>
      <div className="nav__search">{<Search />}</div>
      <div className="nav__right">{<Profile />}</div>
    </div>
  );
};

export default Navbar;
