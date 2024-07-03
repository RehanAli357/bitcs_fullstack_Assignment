import React from 'react';
import { NavLink } from 'react-router-dom';
import SmLogo from "../Assets/big-logo.png"
import User from "../Assets/user.png";
import { useCookies } from 'react-cookie';
const NavigationBar = () => {
  const [cookies]=useCookies(['roleId'])
  return (
    <div className="navigation-bar">
      <div className="nav-logo">
        <NavLink to={cookies.roleId==="cus001" ? '/home':'/dashboard'}>
          <img src={SmLogo} alt="Logo" />
        </NavLink>
      </div>
      <div className="nav-links">
        <NavLink to={cookies.roleId==="cus001" ? '/home':'/dashboard'} activeclassname="active-link">
        {cookies.roleId==="cus001" ? 'Home':'Dashboard'}
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
    </div>
  );
}

export default NavigationBar;
