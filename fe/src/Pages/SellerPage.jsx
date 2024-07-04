import React, { useEffect, useState } from 'react'
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import commonAxios from '../Global/CommonAxios/commonAxios';

const SellerPage = () => {
    const [cookies] = useCookies(["accessToken"]);
    const [data, setData] = useState([]);
    const navigate = useNavigate();
  
    const getAllCustomer = async () => {
      const response = await commonAxios(
        "admin/fetch-seller",
        "GET",
        {},
        cookies.accessToken
      );
      if (response.status === 200) {
        setData(response.data);
      }
    };
  
    useEffect(() => {
      if (cookies.accessToken) {
        getAllCustomer();
      } else {
        navigate("/login");
      }
    }, [cookies.accessToken]);
    return (
      <>
        <div className="AdminPanel">
          <h1>Seller Details</h1>
  
          <div className="AdminPanel-Tabs">
            {data.length > 0
              ? data.map((item) => {
                  return (
                    <div className="PanelCard CardDetails" key={item.sId}>
                      <p>Name {item.sName}</p>
                      <p>Emai {item.sEmail}</p>
                      <p>Role {item.roleId}</p>
                      <p>Id {item.sId}</p>
                    </div>
                  );
                })
              : "No data"}
          </div>
        </div>
      </>
    );
}

export default SellerPage