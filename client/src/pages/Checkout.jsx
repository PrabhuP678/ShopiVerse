import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Card, Input, Button, Row, Col, Form, message } from "antd";
import PaymentForm from "../context/PaymentForm";
import Layout from "../components/Layout/Layout";
import "../public/Checkout.css";

// Load Stripe public key
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const Checkout = () => {
  const location = useLocation();

  const cartItems = location.state?.cartItems || [];
  const product = location.state?.product || null;

  const [billingDetails, setBillingDetails] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zip: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBillingDetails((prevDetails) => ({ ...prevDetails, [name]: value }));
  };

  const calculateTotal = () => {
    if (cartItems.length > 0) {
      return cartItems.reduce(
        (total, item) => total + item.product.price * item.quantity,
        0
      );
    }
    return product ? product.price : 0;
  };

  const handlePlaceOrder = () => {
    if (
      !billingDetails.name ||
      !billingDetails.email ||
      !billingDetails.address
    ) {
      message.error("Please fill in all the billing details.");
      return;
    }

    message.success("Proceeding to payment...");
    // No need to directly handle order placing here, PaymentForm will manage it.
  };

  if (cartItems.length === 0 && !product) {
    return <div>No items or product selected for checkout.</div>;
  }

  return (
    <Layout title="Checkout">
      <div className="checkout-page">
        <h1>Checkout</h1>
        <Row gutter={24}>
          <Col xs={24} md={12}>
            <Card title="Order Summary" className="checkout-card">
              <div className="product-summary">
                {cartItems.length > 0
                  ? cartItems.map((item) => (
                      <div
                        key={item.product._id}
                        className="product-summary-item"
                      >
                        <img
                          src={`${process.env.REACT_APP_API}/api/v1/products/product-photo/${item.product._id}`}
                          alt={item.product.name}
                          className="product-summary-image"
                        />
                        <div className="product-summary-details">
                          <h3>{item.product.name}</h3>
                          <p>Price: ${item.product.price.toFixed(2)}</p>
                          <p>Quantity: {item.quantity}</p>
                        </div>
                      </div>
                    ))
                  : product && (
                      <div className="product-summary-item">
                        <img
                          src={`${process.env.REACT_APP_API}/api/v1/products/product-photo/${product._id}`}
                          alt={product.name}
                          className="product-summary-image"
                        />
                        <div className="product-summary-details">
                          <h3>{product.name}</h3>
                          <p>Price: ${product.price.toFixed(2)}</p>
                          <p>Quantity: 1</p>
                        </div>
                      </div>
                    )}
              </div>
              <div className="order-summary">
                <p>
                  <strong>Total:</strong> ${calculateTotal().toFixed(2)}
                </p>
              </div>
            </Card>
          </Col>

          <Col xs={24} md={12}>
            <Card title="Billing Information" className="checkout-card">
              <Form layout="vertical">
                <Form.Item label="Full Name">
                  <Input
                    name="name"
                    value={billingDetails.name}
                    onChange={handleInputChange}
                  />
                </Form.Item>
                <Form.Item label="Email Address">
                  <Input
                    name="email"
                    value={billingDetails.email}
                    onChange={handleInputChange}
                  />
                </Form.Item>
                <Form.Item label="Address">
                  <Input
                    name="address"
                    value={billingDetails.address}
                    onChange={handleInputChange}
                  />
                </Form.Item>
                <Row gutter={16}>
                  <Col xs={24} md={8}>
                    <Form.Item label="City">
                      <Input
                        name="city"
                        value={billingDetails.city}
                        onChange={handleInputChange}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={8}>
                    <Form.Item label="State">
                      <Input
                        name="state"
                        value={billingDetails.state}
                        onChange={handleInputChange}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={8}>
                    <Form.Item label="Zip Code">
                      <Input
                        name="zip"
                        value={billingDetails.zip}
                        onChange={handleInputChange}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col xs={24}>
            <Card title="Payment Information" className="checkout-card">
              <Elements stripe={stripePromise}>
                <PaymentForm
                  cartItems={cartItems}
                  product={product}
                  billingDetails={billingDetails}
                />
              </Elements>
            </Card>
          </Col>
        </Row>
      </div>
    </Layout>
  );
};

export default Checkout;
