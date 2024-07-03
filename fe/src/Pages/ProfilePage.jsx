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
  const handleSubmit = (e) => {
    e.preventDeault();
    if(cookies.roleId==="cus001"){

    }else{
     console.log(changePassword) 
    }
  };

  const deleteAccount = ()=>{
    console.log("first")
  }
  const renderUser = () => {
    return (
      <div className="profile-container">
        <img src={Profile} alt="user-profile" className="profile-image" />
        <p className="profile-name">{cookies.roleId==="cus001" ? user.cName:user.sName}</p>
        <p className="profile-email">{cookies.roleId==="cus001" ? user.cEmail:user.sEmail}</p>
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
        <div className="profile-actions">
          <button onClick={logoutUser} className="secondary-btn">
            Logout
          </button>
          <button onClick={deleteAccount}className="danger-btn">Delete Account</button>
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
      getPaymentHistory();
      getUSer();
    }
  }, [cookies.accessToken]);

  return (
    <div className="profile-page">
      <ToastContainer />
      {user ? renderUser() : "No Details Found"}
      {loading ? (
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
              <div className="payment-row no-data">No Data Found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
