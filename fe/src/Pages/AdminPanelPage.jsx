import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import commonAxios from "../Global/CommonAxios/commonAxios";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const AdminPanelPage = () => {
  const [cookies] = useCookies(["accessToken"]);
  const [data, setData] = useState({
    customerCount: 0,
    sellerCount: 0,
    bikeCount: 0,
    customerRevenue: 0,
    sellerRevenue: 0,
  });
  const navigate = useNavigate();

  const getCustomerCount = async () => {
    const response = await commonAxios(
      "admin/fetch-customer-count",
      "GET",
      {},
      cookies.accessToken
    );
    if (response.status === 200) {
      setData((pdata) => ({
        ...pdata,
        customerCount: response.data,
      }));
    } else {
      toast.error(response.response.data.message);
    }
  };

  const getSellerCount = async () => {
    const response = await commonAxios(
      "admin/fetch-seller-count",
      "GET",
      {},
      cookies.accessToken
    );
    if (response.status === 200) {
      setData((pdata) => ({
        ...pdata,
        sellerCount: response.data,
      }));
    } else {
      toast.error(response.response.data.message);
    }
  };

  const getBikeCount = async () => {
    const response = await commonAxios(
      "admin/fetch-bike-count",
      "GET",
      {},
      cookies.accessToken
    );
    if (response.status === 200) {
      setData((pdata) => ({
        ...pdata,
        bikeCount: response.data,
      }));
    } else {
      toast.error(response.response.data.message);
    }
  };

  const getCustomerRevenue = async () => {
    const response = await commonAxios(
      "admin/fetch-customer-revenue",
      "GET",
      {},
      cookies.accessToken
    );
    if (response.status === 200) {
      setData((pdata) => ({
        ...pdata,
        customerRevenue: response.data,
      }));
    }
  };
  const getSellerRevenue = async () => {
    const response = await commonAxios(
      "admin/fetch-seller-revenue",
      "GET",
      {},
      cookies.accessToken
    );
    if (response.status === 200) {
      setData((pdata) => ({
        ...pdata,
        sellerRevenue: response.data,
      }));
    }
  };

  useEffect(() => {
    if (cookies.accessToken) {
      getCustomerCount();
      getSellerCount();
      getBikeCount();
      getCustomerRevenue();
      getSellerRevenue();
    } else {
      navigate("/login");
    }
  }, [cookies.accessToken]);
  return (
    <>
      <div className="AdminPanel">
        <ToastContainer />
        <h1>Admin Panel</h1>
        <div className="AdminPanel-Tabs">
          <div className="PanelCard">
            <p>Total Customer {data.customerCount}</p>
          </div>

          <div className="PanelCard">
            <p>Total Seller {data.sellerCount}</p>
          </div>

          <div className="PanelCard">
            <p>Total Bike {data.bikeCount}</p>
          </div>

          <div
            className="PanelCard"
            onClick={() => {
              navigate("/customer-revenue");
            }}
          >
            <p>Total Customer Revenue &#8377; {data.customerRevenue} </p>
          </div>

          <div
            className="PanelCard"
            onClick={() => {
              navigate("/seller-revenue");
            }}
          >
            <p>Total Seller Revenue &#8377; {data.sellerRevenue} </p>
          </div>

          <div
            className="PanelCard"
            onClick={() => {
              navigate("/all-customer");
            }}
          >
            <p>Show All Customers Details</p>
          </div>

          <div
            className="PanelCard"
            onClick={() => {
              navigate("/all-seller");
            }}
          >
            <p>Show All Sellers Details</p>
          </div>

          <div
            className="PanelCard"
            onClick={() => {
              navigate("/all-bikes");
            }}
          >
            <p>Show All Bikes Details</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminPanelPage;
