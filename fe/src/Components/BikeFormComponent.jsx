import React, { useEffect, useState } from "react";
import bikeSchema from "../Schema/bikeSchema";
import addBikeSchema from "../Schema/addBikeSchema";
import commonAxios from "../Global/CommonAxios/commonAxios";
import { useCookies } from "react-cookie";
import { ToastContainer, toast } from "react-toastify";
import { uploadImage } from "../Firebase/ImageUpload";
import { useNavigate } from "react-router-dom";

const BikeFormComponent = ({ bikeData, type }) => {
  const [data, setData] = useState({
    bName: "",
    bImage: "",
    bPrice: "",
    bType: "",
    bId: "",
    available: true,
  });
  const [errors, setErrors] = useState({});
  const [cookie] = useCookies(["accessToken"]);
  const navigate = useNavigate();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleImage = async (e) => {
    const { name, files } = e.target;
    const image = files[0];
    const imageUrl = await uploadImage(image);
    setData((pdata) => ({
      ...pdata,
      [name]: imageUrl,
    }));
  };
  const validate = () => {
    let error;
    if (type === "add") {
      ({ error } = addBikeSchema.validate(data, { abortEarly: false }));
    } else {
      ({ error } = bikeSchema.validate(data, { abortEarly: false }));
    }
    if (error) {
      const errors = {};
      error.details.forEach((detail) => {
        errors[detail.path[0]] = detail.message;
      });
      setErrors(errors);
      return false;
    }
    setErrors({});
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let response;

    if (validate() && cookie.accessToken) {
      if (type === "edit") {
        response = await commonAxios(
          "seller/update-bike",
          "PUT",
          data,
          cookie.accessToken
        );
      } else {
        response = await commonAxios(
          "seller/add-bike",
          "POST",
          data,
          cookie.accessToken
        );
      }
      if (response.status === 200 || response.status === 201) {
        navigate("/dashboard");
      } else {
        toast.error(response?.response?.data?.message);
      }
    }
  };
  useEffect(() => {
    if (type === "add") {
      setData({
        bName: "",
        bImage: "",
        bPrice: "",
        bType: "",
        available: true,
      });
    }
  }, []);
  useEffect(() => {
    if (bikeData) {
      setData({
        bImage: bikeData.bImage || null,
        bName: bikeData.bName,
        bPrice: bikeData.bPrice,
        bType: bikeData.bType,
        bId: bikeData.bId,
        available: bikeData.available,
      });
    }
  }, [bikeData]);

  return (
    <div className="bike-form-container">
      <ToastContainer />
      <form onSubmit={handleSubmit}>
        <label htmlFor="bName">Name:</label>
        <input
          value={data.bName}
          type="text"
          name="bName"
          id="bName"
          onChange={handleChange}
        />
        {errors.bName && <p className="error">{errors.bName}</p>}

        <label htmlFor="bPrice">Price:</label>
        <input
          type="number"
          value={data.bPrice}
          name="bPrice"
          id="bPrice"
          onChange={handleChange}
        />
        {errors.bPrice && <p className="error">{errors.bPrice}</p>}

        <label htmlFor="bType">Type:</label>
        <input
          type="text"
          value={data.bType}
          name="bType"
          id="bType"
          onChange={handleChange}
        />
        {errors.bType && <p className="error">{errors.bType}</p>}

        <label htmlFor="bImage">Image:</label>
        <input type="file" name="bImage" id="bImage" onChange={handleImage} />
        {errors.bImage && <p className="error">{errors.bImage}</p>}

        <div>
          <p>Bike Available</p>
          <input
            type="radio"
            id="available-yes"
            name="available"
            value="true"
            checked={data.available === true}
            onChange={handleChange}
          />
          <label htmlFor="available-yes">Yes</label>
        </div>

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default BikeFormComponent;
