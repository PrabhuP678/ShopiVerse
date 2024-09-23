import React, { useState } from "react";
import Layout from "../../components/Layout/Layout";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../../context/auth";
import "../../public/Login.css";

const API_BASE_URL = process.env.REACT_APP_API || "http://localhost:8080";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [auth, setAuth] = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      toast.error("Please fill out all fields");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setLoading(true);
    try {
      console.log("API_BASE_URL:", API_BASE_URL); // Log API_BASE_URL
      console.log("Submitting form data:", formData);
      const result = await axios.post(
        `${API_BASE_URL}/api/v1/auth/login`,
        formData
      );
      console.log(
        "Stored auth data:",
        JSON.parse(localStorage.getItem("auth"))
      );

      console.log("API response:", result);

      if (result.data.success) {
        toast.success(result.data.message, {
          position: "top-center",
          duration: 3000,
        });
        setAuth({ ...auth, user: result.data.user, token: result.data.token });
        localStorage.setItem("auth", JSON.stringify(result.data));

        console.log("Navigating to home page...");
        navigate("/");
      } else {
        toast.error(result.data.message, {
          position: "top-center",
          duration: 3000,
        });
      }
    } catch (error) {
      console.error("Error during login:", error); // Log full error object
      if (error.response) {
        // Server responded with a status other than 200 range
        console.error("Server response error:", error.response);
        console.error("Error response data:", error.response.data); // Log response data
        toast.error(error.response.data?.message || "Something went wrong", {
          position: "top-center",
          duration: 3000,
        });
      } else if (error.request) {
        // Request was made but no response received
        console.error("No response received:", error.request);
        toast.error("No response from server. Please try again later.", {
          position: "top-center",
          duration: 3000,
        });
      } else {
        // Something else happened
        console.error("Unexpected error:", error.message);
        toast.error("An unexpected error occurred. Please try again.", {
          position: "top-center",
          duration: 3000,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    navigate("/forgot-password");
  };

  return (
    <Layout>
      <div className="login-container">
        <form className="login-form" onSubmit={handleSubmit}>
          <h1 className="mb-4">Login Page</h1>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email address
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              className="form-control"
              id="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleForgotPassword}
            disabled={loading}
          >
            Forgot Password
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default Login;
