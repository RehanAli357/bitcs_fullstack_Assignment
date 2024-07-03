import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import commonAxios from "../Global/CommonAxios/commonAxios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import BikeComponent from "../Components/BikeComponent";

const DashboardPage = () => {
  const [allBikes, setBikeData] = useState([]);
  const [cookies] = useCookies(["accessToken"]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const getItem = async () => {
    const response = await commonAxios(
      "seller/get-bike",
      "GET",
      {},
      cookies.accessToken
    );
    if (response.status === 200) {
      setBikeData(response.data);
      setLoading(false)
    } else {
      toast.error(response.response.data.message);
    }
  };
  useEffect(() => {
    if (cookies.accessToken) {
      getItem();
    } else {
      navigate("/login");
    }
  }, [cookies.accessToken]);

  return (
    <div className="home-container">
      <ToastContainer />
      <div className="return-button-container">
        <button
          className="return-button"
          onClick={() => {
            navigate("/add-bike");
          }}
        >
          Add Bike
        </button>
      </div>
      <div className="header">
        <h1>See All Your Bikes Data</h1>
      </div>
      {loading ? (
        <p className="loading">Loading...</p>
      ) : (
        <>
          {allBikes.length > 0 ? (
            <div className="bike-cards">
              {allBikes.map((data) => {
                return <BikeComponent data={data}  getItem={getItem}/>;
              })}
            </div>
          ) : (
            <p className="no-data">No Data Found</p>
          )}
        </>
      )}
    </div>
  );
};

export default DashboardPage;
