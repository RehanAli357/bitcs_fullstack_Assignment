import React, { useState } from "react";
import { siginInSchema } from "../Schema/signinSchema";
// import { hashPassowrd } from "../Global/PasswordHash/encryptionPassword";
import commonAxios from "../Global/CommonAxios/commonAxios";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
const SignIn = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [signinAs, setSiginInAs] = useState("");
  const [isCardVisible, setIsCardVisible] = useState(true);
  const navigate = useNavigate();
  const handleOptionClick = (role) => {
    setSiginInAs(role);
    setIsCardVisible(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    const { error } = siginInSchema.validate(
      { ...formData, [name]: value },
      { abortEarly: false }
    );
    if (error) {
      const newErrors = error.details.reduce((acc, detail) => {
        acc[detail.path[0]] = detail.message;
        return acc;
      }, {});
      setErrors(newErrors);
    } else {
      const newErrors = { ...errors };
      delete newErrors[name];
      setErrors(newErrors);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { error } = siginInSchema.validate(formData, { abortEarly: false });
    if (error) {
      const errorDetails = error.details.reduce((acc, detail) => {
        acc[detail.path[0]] = detail.message;
        return acc;
      }, {});
      setErrors(errorDetails);
    } else {
      // const hash = await hashPassowrd(formData.password);
      let response;
      // const updatedFormData = { ...formData, password: hash };
      if (signinAs === "customer") {
        response = await commonAxios("customer/add-customer", "POST", formData);
      } else if (signinAs === "seller") {
        response = await commonAxios("seller/add-seller", "POST", formData);
      }
      if (response.status !== 201) {
        toast.error(response.response.data.message);
      } else {
        navigate("/login");
      }
    }
    setFormData({
      name: "",
      email: "",
      password: "",
    });
  };

  return (
    <div className="main-container">
      <ToastContainer />
      {isCardVisible ? (
        <div className="card">
          <h2>Sign In As</h2>
          <button
            className="primary-btn"
            onClick={() => handleOptionClick("customer")}
          >
            Sign In as Customer
          </button>
          <button
            className="primary-btn"
            onClick={() => handleOptionClick("seller")}
          >
            Sign In as Seller
          </button>
          <p
            style={{
              textAlign: "center",
              color: "blue",
              cursor: "pointer",
              marginTop: "15px",
              textDecoration: "underline",
              fontSize: "10px",
            }}
            onClick={() => {
              navigate("/login");
            }}
          >
            Already have Account &rarr;
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="signin-form">
          <h2>
            Sign In as {signinAs.charAt(0).toUpperCase() + signinAs.slice(1)}
          </h2>
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={errors.name ? "error" : ""}
            />
            {errors.name && <p className="error-message">{errors.name}</p>}
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? "error" : ""}
            />
            {errors.email && <p className="error-message">{errors.email}</p>}
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? "error" : ""}
            />
            {errors.password && (
              <p className="error-message">{errors.password}</p>
            )}
          </div>
          <button type="submit" className="primary-btn">
            Sign In
          </button>
          <p
            style={{
              textAlign: "center",
              color: "blue",
              cursor: "pointer",
              marginTop: "15px",
              textDecoration: "underline",
              fontSize: "10px",
            }}
            onClick={() => {
              navigate("/login");
            }}
          >
            Already have Account &rarr;
          </p>
        </form>
      )}
    </div>
  );
};

export default SignIn;
