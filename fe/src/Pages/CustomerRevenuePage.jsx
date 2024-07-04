import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import commonAxios from "../Global/CommonAxios/commonAxios";

const CustomerRevenuePage = () => {
  const [data, setData] = useState([]);
  const [cookies] = useCookies(["accessToken"]);
  const navigate = useNavigate();
  const getRevenue = async () => {
    const response = await commonAxios(
      "admin/customer-revenue",
      "GET",
      {},
      cookies.accessToken
    );
    setData(response.data);
  };
  useEffect(() => {
    if (cookies.accessToken) {
      getRevenue();
    } else {
      navigate("/login");
    }
  }, [cookies.accessToken]);
  return (
    <>
      <div className="AdminPanel">
        <h1>Customers Revenue Details</h1>

        <div className="AdminPanel-Tabs">
          {data.length > 0
            ? data.map((item) => {
                console.log(item);
                return (
                  <div className="PanelCard CardDetails" key={item.cId}>
                    <p>Customer Id {item.cId}</p>
                    <p>Bill Id {item.bId}</p>
                    <p>Duration {item.bTime}</p>
                    <p>Customer Payment Id {item.cpId}</p>
                    <p>Customer Payment time {item.createdTime}</p>
                    <p>Customer Payment Amount &#8377; {item.payment}</p>
                  </div>
                );
              })
            : "No data"}
        </div>
      </div>
    </>
  );
};

export default CustomerRevenuePage;
