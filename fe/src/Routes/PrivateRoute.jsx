import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { cloneElement } from "react";
import { UserContext } from "../Context/userContext";

const PrivateRoute = ({ children }) => {
  const [cookies, , removeCookies] = useCookies(["accessToken","roleId"]);
  const user = useContext(UserContext);
  if (
    !cookies.accessToken &&
    !cookies.roleId &&
    user.data.role &&
    user.data.role !== cookies.roleId
  ) {
    removeCookies(['accessToken','roleId']);
    return <Navigate to="/login" />;
  }

  return cloneElement(children);
};

export default PrivateRoute;
