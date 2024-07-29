import React, { useState } from "react";
import "../styles/Navbar.css";
import { FaSearch, FaBell, FaBars } from "react-icons/fa";
import admin_logo from "../assets/admin_logo.png";
import { IoIosArrowDropdown } from "react-icons/io";

const Navbar = () => {
  return (
    <div className="navbar-container">
      {/* no need of hambergor here */}
      {/* <div className="hamburger-icon" onClick={toggleSidebar}>
        <FaBars />
      </div> */}
      <div className="navbar-search-container">
        <FaSearch className="search-icon" />
        <input type="text" placeholder="Search" />
      </div>
      <div className="navbar-profile">
        <div className="navbar-notification">
          <FaBell className="bell-icon" />
          {/* <span className="badge">6</span> */}
        </div>
        <img src={admin_logo} alt="Profile" />
        <div className="navbar-admin-credentials">
          <span className="name">Dhruv Saboo</span>
          <span className="role">Admin</span>
        </div>
        <IoIosArrowDropdown size={30} />
      </div>
    </div>
  );
};

export default Navbar;
