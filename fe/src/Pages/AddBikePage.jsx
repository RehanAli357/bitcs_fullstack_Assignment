import React from "react";
import BikeFormComponent from "../Components/BikeFormComponent";

const AddBikePage = () => {
  return (
    <div>
      <h1 style={{ textAlign: "center", marginTop: "10px" }}>
        Edit Bike Details
      </h1>
      <BikeFormComponent type={"add"} />
    </div>
  );
};

export default AddBikePage;
