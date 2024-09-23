import React, { useEffect, useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/auth";
import { useCart } from "../../context/CartContext";
import toast from "react-hot-toast";
import axios from "axios";
import { Input, Spin } from "antd";
import "../../public/Header.css";
import { debounce } from "lodash";

const API_URL = process.env.REACT_APP_API;

const fetchCategories = async () => {
  try {
    const { data } = await axios.get(`${API_URL}/api/v1/category/get-category`);
    if (data.success) return data.data;
    toast.error("Failed to fetch categories");
    return [];
  } catch (error) {
    console.error("Error fetching categories:", error.message);
    toast.error(`Error fetching categories: ${error.message}`);
    return [];
  }
};

const Header = () => {
  const [auth, setAuth] = useAuth();
  const { cartItems, clearCart } = useCart();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const getCategories = async () => {
      setLoading(true);
      const categoriesData = await fetchCategories();
      setCategories(categoriesData);
      setLoading(false);
    };
    getCategories();
  }, []);

  const handleLogout = debounce(() => {
    setAuth({ ...auth, user: null, token: "" });
    localStorage.removeItem("auth");
    clearCart();
    toast.success("Logged out successfully", {
      duration: 5000,
      position: "top-center",
    });
  }, 300);

  const handleSearch = (value) => {
    navigate(`/search?query=${encodeURIComponent(value)}`);
  };

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const NavItem = ({ to, label, isActive }) => (
    <li className="nav-item">
      <NavLink to={to} className="nav-link">
        {({ isActive }) => <b className={isActive ? "active" : ""}>{label}</b>}
      </NavLink>
    </li>
  );

  const DropdownMenu = ({ id, items, label }) => (
    <li className="nav-item dropdown">
      <a
        className="nav-link dropdown-toggle"
        href="#"
        id={id}
        role="button"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        {label}
      </a>
      <ul className="dropdown-menu" aria-labelledby={id}>
        {items}
      </ul>
    </li>
  );

  // Determine the correct dashboard path based on user role
  const dashboardPath =
    auth?.user?.role === 1 ? "/dashboard/admin" : "/dashboard";

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light sticky-header">
      <div className="container-fluid">
        <Link to="/" className="navbar-brand">
          ShopiVerse
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarTogglerDemo01"
          aria-controls="navbarTogglerDemo01"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarTogglerDemo01">
          <ul className="navbar-nav mx-auto mb-2 mb-lg-0 d-flex align-items-center">
            <li className="nav-item">
              <Input.Search
                placeholder="Search for Products,Brands and More"
                onSearch={handleSearch}
                enterButton
                className="search-bar"
              />
            </li>
            <NavItem to="/" label="Home" />
            <NavItem to="/categories" label="Shop by Category" />

            {!auth.user ? (
              <>
                <NavItem to="/register" label="Register" />
                <NavItem to="/login" label="Login" />
              </>
            ) : (
              <>
                <DropdownMenu
                  id="profileDropdown"
                  label="Profile"
                  items={[
                    <li key="dashboard">
                      <NavLink to={dashboardPath} className="dropdown-item">
                        Dashboard
                      </NavLink>
                    </li>,
                    <li key="logout">
                      <NavLink
                        to="/login"
                        className="dropdown-item"
                        onClick={handleLogout}
                      >
                        LogOut
                      </NavLink>
                    </li>,
                  ]}
                />
                <NavItem to="/cart" label={`Cart (${cartCount})`} />
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
