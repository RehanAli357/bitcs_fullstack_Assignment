import React from "react";
import { Route, Routes } from "react-router-dom";
import HomePage from "../Pages/HomePage";
import SiginInPage from "../Pages/SiginInPage";
import BikePage from "../Pages/BikePage";
import LoginPage from "../Pages/LoginPage";
import ReturnPage from "../Pages/ReturnPage";
const AllRoutes = () => {
  return (
    <Routes>
      <Route path="/siginin" element={<SiginInPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/bike/:id" element={<BikePage />} />
      <Route path="/return" element={<ReturnPage/>}/>
    </Routes>
  );
};

export default AllRoutes;
