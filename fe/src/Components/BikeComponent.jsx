import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../Context/userContext";
import { BikeContext } from "../Context/bikeContext";
import { useCookies } from "react-cookie";
import commonAxios from "../Global/CommonAxios/commonAxios";
import { toast } from "react-toastify";

const BikeComponent = ({ data ,getItem}) => {
  const [cookies] = useCookies(["accessToken", "roleId"]);
  const user = useContext(UserContext);
  const Bike = useContext(BikeContext);
  const navigate = useNavigate();
  const handleRent = (bId) => {
    navigate(`/bike/${bId}`);
  };

  const editDetails = (data) => {
    Bike.setBike({
      bId: data.bId,
      bImage: data.bImage,
      bName: data.bName,
      bPrice: data.bPrice,
      bType: data.bType,
    });
    navigate(`/edit-bike`);
  };

  const deleteBike = async (bId) => {
    let res;
    try {
      res = await commonAxios(
        "seller/delete-bike",
        "DELETE",
        { bId: bId },
        cookies.accessToken
      );
      if (res.status === 200) {
        toast.success(res.data.message);
        getItem()
      }
    } catch (error) {
      console.log(error.message)
      toast.error(res.response.data.message);
    }
  };
  const handleDetails = (bId) => {
    navigate(`/bike/${bId}`);
  };
  return (
    <div className="bike-card" key={data.bId}>
      {data.bImage ? (
        <img src={data.bImage} alt={data.bName} className="bike-image" />
      ) : (
        <p className="no-image">No Image Uploaded Yet</p>
      )}
      <div className="bike-info">
        <p className="bike-name">{data.bName}</p>
        <p className="bike-price">Price: ${data.bPrice}/hr</p>
      </div>
      <div className="bike-actions">
        {data.available === true &&
        (data?.cId?.length <= 0 || data.cId === null) ? (
          cookies.roleId === "sel001" ? (
            <button
              className="primary-btn"
              onClick={() =>
                editDetails({
                  bId: data.bId,
                  bName: data.bName,
                  bImage: data.bImage,
                  bPrice: data.bPrice,
                  bType: data.bType,
                })
              }
            >
              Edit Bike Details
            </button>
          ) : (
            <button
              className="primary-btn"
              onClick={() => handleRent(data.bId)}
            >
              Rent a Bike
            </button>
          )
        ) : (
          <p className="unavailable">Bike Is Unavailable</p>
        )}

        <button
          className="primary-btn secondary-btn"
          onClick={() => handleDetails(data.bId)}
        >
          Bike Details
        </button>
        {cookies.roleId !== "cus001" && data.available === true &&
        (data?.cId?.length <= 0 || data.cId === null)? (
          <button
            onClick={() => {
              deleteBike(data.bId);
            }}
            className="primary-btn"
            style={{ backgroundColor: "red" }}
          >
            Delete Bike
          </button>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default BikeComponent;
