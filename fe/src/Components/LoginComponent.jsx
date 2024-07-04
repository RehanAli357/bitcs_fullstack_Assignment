import React, { useContext, useState } from "react";
import { logInSchema } from "../Schema/loginSchema";
import { hashPassowrd } from "../Global/PasswordHash/encryptionPassword";
import commonAxios from "../Global/CommonAxios/commonAxios";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import "react-toastify/dist/ReactToastify.css";
import { UserContext } from "../Context/userContext";
const Login = ({ signinAs }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [loginAs, setLoginAs] = useState(signinAs);
  const [cookies, setCookie] = useCookies(["accessToken", "roleId"]);
  const navigate = useNavigate();
  const user = useContext(UserContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    const { error } = logInSchema.validate(
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
    const { error } = logInSchema.validate(formData, { abortEarly: false });

    if (error) {
      const errorDetails = error.details.reduce((acc, detail) => {
        acc[detail.path[0]] = detail.message;
        return acc;
      }, {});
      setErrors(errorDetails);
      return;
    }

    try {
      // const hashedPassword = await hashPassowrd(formData.password);
      // const updatedFormData = { ...formData, password: hashedPassword };
      let response;
      if (loginAs === "customer") {
        response = await commonAxios("customer/login", "POST", formData);
      } else if (loginAs === "seller") {
        response = await commonAxios("seller/login", "POST", formData);
      }else{
        response  = await commonAxios ("admin/login","POST",formData)
      }

      if (response.status === 201) {
        setCookie("accessToken", response.data.access_token);
        const res = await commonAxios(
          loginAs,
          "GET",
          {},
          response.data.access_token
        );
        if (res.status === 200) {
          if (loginAs === "customer") {
            user.setData({
              name: res.data.cName,
              id: res.data.cId,
              role: res.data.roleId,
              email: res.data.cEmail,
            });
            navigate("/home");
          } else if (loginAs === "seller") {
            navigate("/dashboard");
            user.setData({
              name: res.data.sName,
              id: res.data.sId,
              role: res.data.roleId,
              email: res.data.sEmail,
            });
          }else{
            navigate("/admin-panel");
            user.setData({
              name:res.data.aName,
              id:res.data.aId,
              role:res.data.roleId,
              email:res.data.aEmail,
            })
          }
          setCookie("roleId", res.data.roleId);
        }
      } else {
        toast.error(
          response.response.data.message ||
            "An error occurred. Please try again."
        );
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setFormData({
        email: "",
        password: "",
      });
    }
  };
  return (
    <div className="main-container">
      <ToastContainer />

      <form onSubmit={handleSubmit} className="signin-form">
        <h2>Login as {loginAs}</h2>

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
          Login
        </button>
        {loginAs === "customer" ? (
          <>
            <p
              onClick={() => {
                setLoginAs("seller");
              }}
              style={{ textAlign: "center", color: "blue", cursor: "pointer" }}
            >
              Login as Seller
            </p>
            <p
              onClick={() => {
                setLoginAs("admin");
              }}
              style={{ textAlign: "center", color: "blue", cursor: "pointer" }}
            >
              Login as Admin
            </p>
          </>
        ) : loginAs==="admin" ? (
          <>
          <p
            onClick={() => {
              setLoginAs("customer");
            }}
            style={{ textAlign: "center", color: "blue", cursor: "pointer" }}
          >
            Login as Customer
          </p>
          <p
            onClick={() => {
              setLoginAs("seller");
            }}
            style={{ textAlign: "center", color: "blue", cursor: "pointer" }}
          >
            Login as Seller
          </p>
          </>
        ):(
        <>
        <p
            onClick={() => {
              setLoginAs("customer");
            }}
            style={{ textAlign: "center", color: "blue", cursor: "pointer" }}
          >
            Login as Customer
          </p>
          <p
            onClick={() => {
              setLoginAs("admin");
            }}
            style={{ textAlign: "center", color: "blue", cursor: "pointer" }}
          >
            Login as Admin
          </p>
        </>)}
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
            navigate("/siginin");
          }}
        >
          Create New Account &rarr;
        </p>
      </form>
    </div>
  );
};

export default Login;
