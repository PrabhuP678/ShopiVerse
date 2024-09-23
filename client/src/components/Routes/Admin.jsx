import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/auth";
import { Navigate, Outlet } from "react-router-dom";
import axios from "axios";
import Spinner from "../spinner";

const AdminRoute = () => {
  const [auth] = useAuth(); // Using destructured 'auth' to avoid unnecessary re-rendering
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const checkAdminAuth = async () => {
      if (auth?.token) {
        try {
          const res = await axios.get(
            `${process.env.REACT_APP_API}/api/v1/auth/admin-auth`,
            {
              headers: {
                Authorization: `Bearer ${auth.token}`,
              },
            }
          );

          if (res.data.ok && auth.user?.role === 1) {
            setIsAuthorized(true);
          } else {
            setIsAuthorized(false);
          }
        } catch (error) {
          console.error("Error verifying admin:", error);
          setIsAuthorized(false);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
        setIsAuthorized(false);
      }
    };

    checkAdminAuth();
  }, [auth?.token, auth?.user?.role]);

  if (loading) {
    return <Spinner />;
  }

  if (!isAuthorized) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
};

export default AdminRoute;
