import React, { useState } from "react";
import Layout from "../../components/Layout/Layout";
import Profile from "./Profile";
import OrderPage from "./OrdersPage";
import "../../public/Dashboard.css"; // Import your CSS for custom styling

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("orders"); // State to manage active tab

  return (
    <Layout title={"Dashboard"}>
      <div className="dashboard">
        <div className="dashboard-tabs">
          <button
            className={`dashboard-tab ${
              activeTab === "orders" ? "active" : ""
            }`}
            onClick={() => setActiveTab("orders")}
          >
            Orders
          </button>
          <button
            className={`dashboard-tab ${
              activeTab === "profile" ? "active" : ""
            }`}
            onClick={() => setActiveTab("profile")}
          >
            Profile
          </button>
        </div>
        <div className="dashboard-content">
          {activeTab === "orders" && <OrderPage />}
          {activeTab === "profile" && <Profile />}
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
