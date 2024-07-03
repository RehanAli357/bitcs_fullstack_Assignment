import React, { useContext } from "react";
import BikeFormComponent from "../Components/BikeFormComponent";
import { BikeContext } from "../Context/bikeContext";

const EditBike = () => {
  const Bike = useContext(BikeContext);

  return (
    <div>
      <h1 style={{ textAlign: "center", marginTop: "10px" }}>
        Edit Bike Details
      </h1>
      <BikeFormComponent bikeData={Bike.bike} type={"edit"} />
    </div>
  );
};

export default EditBike;
