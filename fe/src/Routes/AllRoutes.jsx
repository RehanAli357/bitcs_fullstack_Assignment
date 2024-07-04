import React from "react";
import { Route, Routes } from "react-router-dom";
import HomePage from "../Pages/HomePage";
import SiginInPage from "../Pages/SiginInPage";
import BikePage from "../Pages/BikePage";
import LoginPage from "../Pages/LoginPage";
import ReturnPage from "../Pages/ReturnPage";
import PrivateRoute from "./PrivateRoute";
import AboutPage from "../Pages/AboutPage";
import ContactPage from "../Pages/ContactPage";
import ProfilePage from "../Pages/ProfilePage";
import DashboardPage from "../Pages/Dashboard";
import EditBike from "../Pages/EditBike";
import AddBikePage from "../Pages/AddBikePage";
import AdminPanelPage from "../Pages/AdminPanelPage";
import CustomersPage from "../Pages/CustomersPage";
import SellerPage from "../Pages/SellerPage";
import AllBikesPage from "../Pages/AllBikesPage";
import CustomerRevenuePage from "../Pages/CustomerRevenuePage";
import SellerRevenuePage from "../Pages/SellerRevenuePage";
const AllRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/siginin" element={<SiginInPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/home"
        element={
          <PrivateRoute>
            <HomePage />
          </PrivateRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <DashboardPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin-panel"
        element={
          <PrivateRoute>
            <AdminPanelPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/all-customer"
        element={
          <PrivateRoute>
            <CustomersPage />
          </PrivateRoute>
        }
      />
      <Route
      path="/customer-revenue"
      element={
        <PrivateRoute>
          <CustomerRevenuePage/>
        </PrivateRoute>
      }
      />
      <Route
      path="/seller-revenue"
      element={
        <PrivateRoute>
          <SellerRevenuePage/>
        </PrivateRoute>
      }
      />
      <Route
        path="/all-seller"
        element={
          <PrivateRoute>
            <SellerPage />
          </PrivateRoute>
        }
      />
      <Route
      path="/all-bikes"
      element={
        <PrivateRoute>
          <AllBikesPage/>
        </PrivateRoute>
      }
      />
      <Route
        path="/bike/:id"
        element={
          <PrivateRoute>
            <BikePage />
          </PrivateRoute>
        }
      />
      <Route
        path="/edit-bike"
        element={
          <PrivateRoute>
            <EditBike />
          </PrivateRoute>
        }
      />
      <Route
        path="/add-bike"
        element={
          <PrivateRoute>
            <AddBikePage />
          </PrivateRoute>
        }
      />
      <Route
        path="/return"
        element={
          <PrivateRoute>
            <ReturnPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <ProfilePage />
          </PrivateRoute>
        }
      />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/contact" element={<ContactPage />} />
    </Routes>
  );
};

export default AllRoutes;
