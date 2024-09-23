// src/pages/Admin/AdminDashboard.js
import React from "react";
import Layout from "../../components/Layout/Layout";
import Adminmenu from "../../components/Layout/Adminmenu";
import { useAuth } from "../../context/auth";
import "../../public/AdminDashboard.css"; // Import the CSS file

const AdminDashboard = () => {
  const [auth] = useAuth();
  return (
    <Layout>
      <div className="admin-dashboard">
        <div className="admin-sidebar">
          {auth?.user && auth.user.role === 1 && <Adminmenu />}
        </div>
        <div className="admin-content">
          <h1>Welcome to the Admin Dashboard</h1>
          <div className="admin-welcome-message">
            <p>
              Hello, {auth.user.name}! Here's an overview of what's happening
              today.
            </p>
          </div>
          <div className="admin-stats">
            <div className="stat-item">
              <h2>120</h2>
              <p>New Users</p>
            </div>
            <div className="stat-item">
              <h2>85</h2>
              <p>New Orders</p>
            </div>
            <div className="stat-item">
              <h2>$5,400</h2>
              <p>Revenue</p>
            </div>
          </div>
          <div className="admin-recent-activity">
            <h2>Recent Activity</h2>
            <ul>
              <li>John Doe added a new product</li>
              <li>Jane Smith created a new category</li>
              <li>Michael Johnson updated user permissions</li>
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
