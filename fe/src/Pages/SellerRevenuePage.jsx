import React, { useEffect, useState } from 'react'
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import commonAxios from '../Global/CommonAxios/commonAxios';

function SellerRevenuePage() {
    const [data, setData] = useState([]);
    const [cookies] = useCookies(["accessToken"]);
    const navigate = useNavigate();
    const getRevenue = async () => {
      const response = await commonAxios(
        "admin/seller-revenue",
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
                  return (
                    <div className="PanelCard CardDetails" key={item.btId}>
                      <p>Bike Id {item.bId}</p>
                      <p>Bill Id {item.btId}</p>
                      <p>Duration {item.bTime}</p>
                      <p>Seller Id {item.sId}</p>
                      <p>Seller Payment time {item.createdTime}</p>
                      <p>Seller Payment Income &#8377; {item.bIncome}</p>
                    </div>
                  );
                })
              : "No data"}
          </div>
        </div>
      </>
    );
}

export default SellerRevenuePage