import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import SmLogo from "../Assets/big-logo.png";
import User from "../Assets/user.png";
import { useCookies } from "react-cookie";

const NavigationBar = () => {
  const [cookies] = useCookies(["roleId"]);
  const [show, setShow] = useState(false);

  return (
    <div className="navigation-bar">
      <div className="nav-logo">
        <NavLink to={cookies.roleId === "cus001" ? "/home" : cookies.roleId==="admin1" ? "/admin-panel":"/dashboard"}>
          <img src={SmLogo} alt="Logo" />
        </NavLink>
      </div>
      <div className="nav-links">
        <NavLink
          to={cookies.roleId === "cus001" ? "/home" : cookies.roleId==="admin1" ? "/admin-panel":"/dashboard"}
          activeclassname="active-link"
        >
          {cookies.roleId === "cus001" ? "Home" : cookies.roleId === "admin1"
              ? "Admin Panel"
              :'Dashboard'}
        </NavLink>
        <NavLink to="/about" activeclassname="active-link">
          About
        </NavLink>
        <NavLink to="/contact" activeclassname="active-link">
          Contact
        </NavLink>
        <div className="user-profile">
          <NavLink to="/profile" activeclassname="active-link">
            <img src={User} alt="User Profile" />
          </NavLink>
        </div>
      </div>

      <span className="large-symbol" onClick={() => setShow(!show)}>
        {show ? "\u269F" : "\u268C"}
      </span>
      {show ? (
        <div className={`mobile-nav`}>
          <NavLink
            onClick={() => {
              setShow(!show);
            }}
            to={cookies.roleId === "cus001" ? "/home" : cookies.roleId==="admin1" ? "/admin-panel":"/dashboard"}
            activeclassname="active-link"
          >
            {cookies.roleId === "cus001"
              ? "Home"
              : cookies.roleId === "admin1"
              ? "Admin Panel"
              : "Dashboard"}
          </NavLink>
          <NavLink
            onClick={() => {
              setShow(!show);
            }}
            to="/about"
            activeclassname="active-link"
          >
            About
          </NavLink>
          <NavLink
            onClick={() => {
              setShow(!show);
            }}
            to="/contact"
            activeclassname="active-link"
          >
            Contact
          </NavLink>
          <div className="user-profile">
            <NavLink
              onClick={() => {
                setShow(!show);
              }}
              to="/profile"
              activeclassname="active-link"
            >
              <img src={User} alt="User Profile" />
            </NavLink>
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default NavigationBar;
