import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import commonAxios from "../Global/CommonAxios/commonAxios";
import { ToastContainer, toast } from "react-toastify";
import Profile from "../Assets/user.png";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({});
  const [changePassword, setChangePassword] = useState({
    oldPassword: "",
    newPassword: "",
  });
  const [deleteAccountDetails, setDeleteAccountDetails] = useState({
    email: "",
    password: "",
  });
  const [isDeleted, setIsDeleted] = useState(false);
  const [cookies, , removeCookies] = useCookies(["accessToken", "roleId"]);

  const navigate = useNavigate();

  const getPaymentHistory = async () => {
    try {
      let res;
      if (cookies.roleId === "cus001") {
        res = await commonAxios(
          "customer/fetch-payment",
          "GET",
          {},
          cookies.accessToken
        );
      } else if (cookies.roleId === "sel001") {
        res = await commonAxios(
          "seller/get-bike-taken",
          "GET",
          {},
          cookies.accessToken
        );
      }
      if (res.status === 200) {
        setPayments(res.data);
      } else {
        toast.error(
          res.res.data.message || "An error occurred. Please try again."
        );
      }
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getUSer = async () => {
    let res;
    if (cookies.roleId === "cus001") {
      res = await commonAxios("customer/", "GET", {}, cookies.accessToken);
    } else if (cookies.roleId === "sel001") {
      res = await commonAxios("seller/", "GET", {}, cookies.accessToken);
    } else {
      res = await commonAxios("admin/", "GET", {}, cookies.accessToken);
    }
    if (res.status === 200) {
      setUser(res?.data);
    } else {
      toast.error(
        res.res?.data.message || "An error occurred. Please try again."
      );
    }
  };
  const logoutUser = () => {
    removeCookies("accessToken");
    removeCookies("roleId");
    navigate("/login");
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setChangePassword((pdata) => ({
      ...pdata,
      [name]: value,
    }));
  };

  const handleDeleteChange = (e) => {
    const { name, value } = e.target;
    setDeleteAccountDetails((pdata) => ({
      ...pdata,
      [name]: value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    let response;
    if (cookies.roleId === "cus001") {
      response = await commonAxios(
        "customer",
        "PUT",
        changePassword,
        cookies.accessToken
      );
    } else if (cookies.roleId === "admin1") {
      response = await commonAxios(
        "admin",
        "PUT",
        changePassword,
        cookies.accessToken
      );
    } else {
      response = await commonAxios(
        "seller",
        "PUT",
        changePassword,
        cookies.accessToken
      );
    }
    if (response.status === 200) {
      navigate("/login");
      logoutUser();
    } else {
      toast.error(response?.response?.data?.message);
    }
    setChangePassword({
      oldPassword: "",
      newPassword: "",
    });
  };
  const handleDeleteSubmit = async (e) => {
    e.preventDefault();
    let response;
    if (cookies.roleId === "cus001") {
      response = await commonAxios(
        "customer",
        "DELETE",
        deleteAccountDetails,
        cookies.accessToken
      );
    } else if (cookies.roleId === "admin1") {
      response = await commonAxios(
        "admin",
        "DELETE",
        deleteAccountDetails,
        cookies.accessToken
      );
    } else {
      response = await commonAxios(
        "seller",
        "DELETE",
        deleteAccountDetails,
        cookies.accessToken
      );
    }
    if (response.status === 200) {
      navigate("/signin");
      logoutUser();
    } else {
      toast.error(response?.response?.data?.message);
    }
    setDeleteAccountDetails({
      email: "",
      password: "",
    });
  };

  const deleteAccount = () => {
    setIsDeleted(!isDeleted);
  };
  const renderUser = () => {
    return (
      <div className="profile-container">
        <img src={Profile} alt="user-profile" className="profile-image" />
        <p className="profile-name">
          {cookies.roleId === "cus001" ? user.cName : cookies.roleId==="admin1" ? user.aName : user.sName}
        </p>
        <p className="profile-email">
          {cookies.roleId === "cus001" ? user.cEmail : cookies.roleId==="admin1" ? user.aEmail : user.sEmail}
        </p>
        {!isDeleted ? (
          <div className="update-password">
            <p>Update Password</p>
            <form onSubmit={handleSubmit}>
              <input
                value={changePassword.oldPassword}
                name="oldPassword"
                onChange={handleChange}
                type="password"
                placeholder="Old Password"
                required
              />
              <input
                value={changePassword.newPassword}
                name="newPassword"
                type="password"
                onChange={handleChange}
                placeholder="New Password"
                required
              />
              <button type="submit" className="primary-btn">
                Submit
              </button>
            </form>
          </div>
        ) : (
          <div className="update-password">
            <p>Delete Account</p>
            <form onSubmit={handleDeleteSubmit}>
              <input
                value={deleteAccountDetails.email}
                name="email"
                onChange={handleDeleteChange}
                type="email"
                placeholder="Email Id"
                required
              />
              <input
                value={deleteAccountDetails.password}
                name="password"
                type="password"
                onChange={handleDeleteChange}
                placeholder="Password"
                required
              />
              <button type="submit" className="primary-btn">
                Submit
              </button>
            </form>
          </div>
        )}
        <div className="profile-actions">
          <button onClick={logoutUser} className="secondary-btn">
            Logout
          </button>
          <button onClick={deleteAccount} className="danger-btn">
            {!isDeleted ? "Delete Account" : "Update Password"}
          </button>
        </div>
      </div>
    );
  };

  const renderPaymentsData = (data, index) => {
    if (cookies.roleId === "cus001") {
      return (
        <div className="payment-row" key={data.cpId}>
          <div className="payment-cell">{index + 1}</div>
          <div className="payment-cell">{data.cpId}</div>
          <div className="payment-cell">
            {data.bTime} {data.bTime > 1 ? "hours" : "hour"}
          </div>
          <div className="payment-cell">{data.payment}</div>
          <div className="payment-cell">{data.createdTime}</div>
        </div>
      );
    } else {
      return (
        <div className="payment-row" key={data.btId}>
          <div className="payment-cell">{index + 1}</div>
          <div className="payment-cell">{data.btId}</div>
          <div className="payment-cell">
            {data.bTime} {data.bTime > 1 ? "hours" : "hour"}
          </div>
          <div className="payment-cell">{data.bIncome}</div>
          <div className="payment-cell">{data.createdTime}</div>
        </div>
      );
    }
  };

  useEffect(() => {
    if (cookies.accessToken) {
      getUSer();
      if (cookies.roleId !== "admin1") {
        getPaymentHistory();
      }
    }
  }, [cookies.accessToken]);

  return (
    <div className="profile-page">
      <ToastContainer />
      {user ? renderUser() : "No Details Found"}
      {cookies.roleId !== "admin1" ? (
        loading ? (
          <p className="loading">Loading...</p>
        ) : (
          <div className="payment-history">
            <h2>Payment History</h2>
            <div className="payment-table">
              <div className="payment-row header">
                <div className="payment-cell">SNo.</div>
                <div className="payment-cell">PaymentId</div>
                <div className="payment-cell">Total Hours</div>
                <div className="payment-cell">Total Payment</div>
                <div className="payment-cell">Payment Time</div>
              </div>
              {payments.length > 0 ? (
                payments.map((data, index) => renderPaymentsData(data, index))
              ) : (
                <div className="payment-row">No Data Found</div>
              )}
            </div>
          </div>
        )
      ) : (
        ""
      )}
    </div>
  );
};

export default ProfilePage;
