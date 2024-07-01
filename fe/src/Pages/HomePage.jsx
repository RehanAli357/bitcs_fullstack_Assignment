import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import commonAxios from "../Global/CommonAxios/commonAxios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

const HomePage = () => {
  const [allBikes, setAllBikes] = useState([]);
  const [cookies] = useCookies(["accessToken"]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const getItem = async () => {
    try {
      const response = await commonAxios(
        "customer/get-bikes",
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

  const handleRent = (bikeId) => {
    console.log(`Rent bike with ID: ${bikeId}`);
  };

  const handleDetails = (bikeId) => {
    navigate(`/bike/${bikeId}`);
  };

  const renderCard = (data) => {
    return (
      <div className="bike-card" key={data.bId}>
        {data.bImage ? (
          <img src={data.bImage} alt={data.bName} />
        ) : (
          <p className="no-image">No Image Uploaded Yet</p>
        )}
        <p className="bike-name">{data.bName}</p>
        <p className="bike-price">Price {data.bPrice}/hr</p>
        <div className="bike-actions">
          {data.available === true && data.cId.length > 0 ? (
            <button
              className=" primary-btn secondary-btn"
              onClick={() => handleRent(data.bId)}
            >
              Rent a Bike
            </button>
          ) : (
            <p style={{ margin: "10px 0" }}>Bike Is Unavilable</p>
          )}
          <button
            className="primary-btn details-button"
            onClick={() => handleDetails(data.bId)}
          >
            Bike Details
          </button>
        </div>
      </div>
    );
  };

  useEffect(() => {
    if (cookies.accessToken) {
      getItem();
    }
  }, [cookies.accessToken]);

  return (
    <div className="home-container">
      <ToastContainer />
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button
          className="primary-btn"
          onClick={()=>{navigate("/return")}}
          style={{ backgroundColor: "red", width: "150px" }}
        >
          Return Bike
        </button>
      </div>
      {loading ? (
        <p className="loading">Loading...</p>
      ) : (
        <>
          {allBikes.length > 0 ? (
            <div className="bike-cards">
              {allBikes.map((data) => renderCard(data))}
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
