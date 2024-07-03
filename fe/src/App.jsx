import React, { useState } from "react";
import AllRoutes from "./Routes/AllRoutes";
import NavigationBar from "./Components/NavigationBar";
import { UserContext } from "./Context/userContext";
import { BikeContext } from "./Context/bikeContext";

const App = () => {
  const [data, setData] = useState({
    name: "",
    id: "",
    role: "",
    email: "",
  });

  const [bike, setBike] = useState({
    bId: "",
    bName: "",
    bPrice: "",
    available: "",
    bImage:"",
  });
  return (
    <>
      <UserContext.Provider value={{ data, setData }}>
        <NavigationBar />
        <BikeContext.Provider value={{ bike, setBike }}>
          <AllRoutes />
        </BikeContext.Provider>
      </UserContext.Provider>
    </>
  );
};

export default App;
