import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useParams } from "react-router-dom";
import commonAxios from "../Global/CommonAxios/commonAxios";
import Modal from "react-modal";
import { ToastContainer, toast } from "react-toastify";

Modal.setAppElement("#root");

const BikePage = () => {
  const [bikeData, setBikeData] = useState({});
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [rentalHours, setRentalHours] = useState(1);
  const { id } = useParams();
  const [cookies] = useCookies(["accessToken"]);

  const getBikeData = async () => {
    try {
      const response = await commonAxios(
        `customer/get-bike/${id}`,
        "GET",
        {},
        cookies.accessToken
      );
      if (response.status === 200) {
        setBikeData(response.data);
      } else {
        setBikeData(null);
      }
    } catch (error) {
      console.error("Error fetching bike data:", error);
      setBikeData(null);
    }
  };

  const handleRentClick = () => {
    setModalIsOpen(true);
  };

  const handleModalClose = () => {
    setModalIsOpen(false);
  };

  const handleRentalHoursChange = (e) => {
    setRentalHours(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(rentalHours, bikeData.bId);
    const payload = { bId: bikeData.bId, bTime: rentalHours };
    const response = await commonAxios(
      `customer/book-bike`,
      "PUT",
      payload,
      cookies.accessToken
    );
    if (response.status === 200) {
      toast.success(response.data.message);
    } else {
      toast.error(
        response.response.data.message ||
          '"An error occurred. Please try again."'
      );
    }
    handleModalClose();
  };

  const renderBikeDetails = () => {
    return (
      <div className="bike-details">
        <h2>{bikeData.bName}</h2>
        {bikeData.bImage ? (
          <img src={bikeData.bImage} alt={bikeData.bName} />
        ) : (
          <p>No Image Uploaded Yet</p>
        )}
        <p>{bikeData.bPrice}</p>
        <p>{bikeData.bType}</p>
        {bikeData.available===true && bikeData.cId.length>0? (
          <button
            className="primary-btn secondary-btn"
            onClick={handleRentClick}
          >
            Rent a Bike
          </button>
        ) : (
          <p>Bike is Not Available</p>
        )}
      </div>
    );
  };

  const rentaBike = () => {
    console.log(bikeData.bId, rentalHours);
  };

  useEffect(() => {
    if (id && cookies.accessToken) {
      getBikeData();
    }
  }, [id, cookies.accessToken]);

  return (
    <div className="bike-page-container">
      <ToastContainer />
      <h1>Bike Details</h1>
      {bikeData ? (
        renderBikeDetails()
      ) : (
        <p className="no-bike-data">No Bike Data Fetched !!</p>
      )}

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={handleModalClose}
        contentLabel="Rent Bike Modal"
        className="modal"
        overlayClassName="modal-overlay"
      >
        <h2>Rent {bikeData.bName}</h2>
        <form onSubmit={handleSubmit} className="rent-bike-form">
          <label htmlFor="rentalHours">Rental Hours:</label>
          <input
            type="range"
            id="rentalHours"
            name="rentalHours"
            min="1"
            max="24"
            value={rentalHours}
            onChange={handleRentalHoursChange}
          />
          <span>
            {rentalHours} hour{rentalHours > 1 ? "s" : ""} X &#8377;{" "}
            {bikeData.bPrice} = &#8377;{rentalHours * bikeData.bPrice}
          </span>
          <button type="submit" className="primary-btn secondary-btn">
            Submit
          </button>
          <button
            type="button"
            className="close-btn"
            onClick={handleModalClose}
          >
            <span className="close">&times;</span>
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default BikePage;
