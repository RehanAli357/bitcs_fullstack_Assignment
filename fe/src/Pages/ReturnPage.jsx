import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { ToastContainer, toast } from "react-toastify";
import commonAxios from "../Global/CommonAxios/commonAxios";
const ReturnPage = () => {
  const [allBikes, setAllBikes] = useState([]);
  const [cookies] = useCookies(["accessToken"]);
  const [loading, setLoading] = useState(true);

  const getItem = async () => {
    try {
      const response = await commonAxios(
        "customer/booked-bike",
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

  const handleReturn = async (bId) => {
    try {
      const res = await commonAxios(
        "customer/return-bike",
        "PUT",
        { bId: bId },
        cookies.accessToken
      );
      if (res.status === 200) {

        toast.success(res.data.message);
        getItem()
      } else {
        toast.error(
          res.response.data.message || "An error occur while returning a bike"
        );
      }
    } catch (error) {
      console.log(error.message);
    }
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
              onClick={() => handleReturn(data.bId)}
            >
              Return Bike
            </button>
          ) : (
            <p style={{ margin: "10px 0" }}>Bike Is Unavilable</p>
          )}
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
    <>
      <ToastContainer />
      <div>
        <h2>Return Page</h2>
        {loading ? (
          <p className="loading">Loading...</p>
        ) : (
          <>
            {allBikes.length > 0 ? (
              <div className="bike-cards">
                {allBikes.map((data) => renderCard(data))}
              </div>
            ) : (
              <p className="no-data">No Bike To Return</p>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default ReturnPage;
