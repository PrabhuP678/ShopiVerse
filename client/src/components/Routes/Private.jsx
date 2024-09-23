import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/auth";
import { Navigate, Outlet } from "react-router-dom";
import axios from "axios";
import Spinner from "../spinner";

const PrivateRoute = () => {
  const [auth] = useAuth();
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [loading, setLoading] = useState(true);
  const API_URL = process.env.REACT_APP_API;

  useEffect(() => {
    const fetchUserData = async () => {
      if (auth?.token) {
        try {
          const res = await axios.get(`${API_URL}/api/v1/auth/user-auth`, {
            headers: {
              Authorization: `Bearer ${auth.token}`,
            },
          });

          if (res.data.ok) {
            setIsAuthenticated(true);
          } else {
            setIsAuthenticated(false);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          setIsAuthenticated(false);
        } finally {
          setLoading(false);
        }
      } else {
        setIsAuthenticated(false);
        setLoading(false);
      }
    };

    fetchUserData();
  }, [auth?.token]);

  if (loading) {
    return <Spinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
};

export default PrivateRoute;
