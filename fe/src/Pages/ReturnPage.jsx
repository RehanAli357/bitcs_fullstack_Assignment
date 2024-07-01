import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { ToastContainer, toast } from "react-toastify";
import commonAxios from "../Global/CommonAxios/commonAxios";
const ReturnPage = () => {
  const [allBikes, setAllBikes] = useState([]);
  const [cookies] = useCookies(["accessToken"]);

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
    }
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
      </div>
    </>
  );
};

export default ReturnPage;
