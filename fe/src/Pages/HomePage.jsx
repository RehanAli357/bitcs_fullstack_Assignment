import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import commonAxios from "../Global/CommonAxios/commonAxios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import BikeComponent from "../Components/BikeComponent";

const HomePage = ({ type }) => {
  const [allBikes, setAllBikes] = useState([]);
  const [cookies] = useCookies(["accessToken"]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const getItem = async () => {
    try {
      const response = await commonAxios(
        `${type === "admin" ? "admin/fetch-bike" : "customer/get-bikes"}`,
        "GET",
        {},
        cookies.accessToken
      );
      if (response.status === 200) {
        setAllBikes(response.data);
      } else {
        toast.error(
          response.response.data.message ||
            "An error occurred while fetching bikes."
        );
      }
    } catch (err) {
      console.log(err.message);
    } finally {
      setLoading(false);
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
      {type !== "admin" ? (
        <div className="return-button-container">
          <button
            className="return-button"
            onClick={() => {
              navigate("/return");
            }}
          >
            Return Bike
          </button>
        </div>
      ) : (
        ""
      )}
      <div className="header">
        <h1>Explore all the different types of bikes</h1>
      </div>
      {loading ? (
        <p className="loading">Loading...</p>
      ) : (
        <>
          {allBikes.length > 0 ? (
            <div className="bike-cards">
              {allBikes.map((data) => (
                <BikeComponent data={data} type={type} />
              ))}
            </div>
          ) : (
            <p className="no-data">No Data Found</p>
          )}
        </>
      )}
    </div>
  );
};

export default HomePage;
