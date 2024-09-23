import React, { useEffect, useState } from "react";
import axios from "axios";
import { Spin, Button, message, Card } from "antd";
import "../../public/OrdersPage.css"; // Import the CSS file

const OrderPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_URL = process.env.REACT_APP_API;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/v1/user/orders`);
        setOrders(response.data.orders || []);
      } catch (err) {
        setError("Failed to fetch orders.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [API_URL]);

  const handleRefresh = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/v1/user/orders`);
      setOrders(response.data.orders || []);
      setError(null);
      message.success("Orders refreshed successfully!");
    } catch (err) {
      setError("Failed to fetch orders.");
      console.error(err);
      message.error("Failed to refresh orders.");
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div style={{ textAlign: "center", padding: "50px 0" }}>
        <Spin tip="Loading your orders..." size="large" />
      </div>
    );

  if (error)
    return (
      <div style={{ color: "red", textAlign: "center", marginTop: "20px" }}>
        {error}
      </div>
    );

  return (
    <div className="order-page">
      <h1 className="order-page-title">Your Orders</h1>
      <Button type="primary" onClick={handleRefresh} className="refresh-button">
        Refresh Orders
      </Button>
      {orders.length === 0 ? (
        <p className="no-orders">You have no orders.</p>
      ) : (
        orders.map((order) => (
          <Card key={order._id} className="order-card">
            <p className="order-status">Status: {order.status}</p>
            <p className="order-info">
              Total Price: ${order.totalPrice?.toFixed(2) || "0.00"}
            </p>
            <p className="order-info">
              Order Date: {new Date(order.createdAt).toLocaleDateString()}
            </p>
            <div className="product-container">
              <h3 className="product-title">Products</h3>
              {order.products &&
                order.products.map((item) => (
                  <div key={item.product?._id} className="product-item">
                    <img
                      src={`${API_URL}/api/v1/products/product-photo/${item.product?._id}`}
                      alt={item.product?.name || "Product"}
                      className="product-image"
                    />
                    <div className="product-details">
                      <p>{item.product?.name || "Unknown"}</p>
                      <p>Price: ${item.product?.price?.toFixed(2) || "0.00"}</p>
                      <p>Quantity: {item.quantity || "0"}</p>
                    </div>
                  </div>
                ))}
            </div>
          </Card>
        ))
      )}
    </div>
  );
};

export default OrderPage;
