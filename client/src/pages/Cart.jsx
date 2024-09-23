import React from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import Layout from "../components/Layout/Layout";
import { Button, Card, InputNumber, message } from "antd";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import "../public/Cart.css";

const { Meta } = Card;

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();

  const handleQuantityChange = (productId, quantity) => {
    if (quantity < 1) {
      message.error("Quantity must be at least 1");
      return;
    }
    updateQuantity(productId, quantity);
  };

  const handleRemove = (productId) => {
    removeFromCart(productId);
  };

  const handleCheckout = () => {
    navigate("/checkout", { state: { cartItems } });
  };

  const handleDoubleClick = (slug) => {
    if (slug) {
      navigate(`/product/${slug}`);
    } else {
      message.error("Product slug is not available");
    }
  };

  if (!cartItems || cartItems.length === 0) {
    return (
      <Layout title="Cart">
        <div className="empty-cart">
          <h2>Your cart is empty</h2>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Shopiverse -Cart">
      <div className="cart-container">
        <h2 className="cart-title">Your Cart</h2>
        <div className="cart-items-grid">
          {cartItems.map((item) => (
            <Card
              key={item.product._id}
              hoverable
              className="cart-item-card"
              cover={
                <img
                  alt={item.product.name}
                  src={`${process.env.REACT_APP_API}/api/v1/products/product-photo/${item.product._id}`}
                  className="product-image"
                  onDoubleClick={() => handleDoubleClick(item.product.slug)}
                />
              }
              onDoubleClick={() => handleDoubleClick(item.product.slug)}
              actions={[
                <div className="quantity-action">
                  <span>Qty: </span>
                  <InputNumber
                    min={1}
                    value={item.quantity}
                    onChange={(value) =>
                      handleQuantityChange(item.product._id, value)
                    }
                    className="quantity-input"
                  />
                </div>,
                <Button
                  onClick={() => handleRemove(item.product._id)}
                  danger
                  className="remove-button"
                >
                  Remove
                </Button>,
              ]}
            >
              <Meta
                title={item.product.name}
                description={`Price: $${item.product.price.toFixed(2)}`}
              />
              <p className="cart-item-total">
                Total: ${(item.product.price * item.quantity).toFixed(2)}
              </p>
            </Card>
          ))}
        </div>
        <div className="checkout-container">
          <h3 className="cart-total">
            Total: $
            {cartItems
              .reduce(
                (total, item) => total + item.product.price * item.quantity,
                0
              )
              .toFixed(2)}
          </h3>
          <Button
            type="primary"
            size="large"
            onClick={handleCheckout}
            disabled={cartItems.length === 0}
            className="checkout-button"
          >
            Proceed to Checkout
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default Cart;
