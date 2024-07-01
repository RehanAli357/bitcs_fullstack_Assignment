import React from "react";
import { useLocation } from "react-router-dom";
import Login from "../Components/LoginComponent";
import BikeLogo from "../Assets/big-logo.png";

const LoginPage = () => {
  const location = useLocation();
  const  loginAs  = location.state || {loginAs:'customer'};
  return (
    <>
      <div className="logo">
        <img src={BikeLogo} alt="bike" />
      </div>
      <Login signinAs={loginAs.loginAs}/>
    </>
  );
};

export default LoginPage;
