import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Button, message, Spin } from "antd";
import axios from "axios";
import "../public/PaymentForm.css";

const PaymentForm = ({ cartItems, product }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardError, setCardError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    const cardElement = elements.getElement(CardElement);

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
    });

    if (error) {
      setCardError(error.message);
      setIsProcessing(false);
      return;
    }

    try {
      let amount = 0;
      let productIds = [];

      if (cartItems && cartItems.length > 0) {
        amount = cartItems.reduce(
          (total, item) => total + item.product.price * item.quantity,
          0
        );
        productIds = cartItems.map((item) => item.product._id);
      } else if (product) {
        amount = product.price;
        productIds = [product._id];
      }

      amount *= 100;

      const { data } = await axios.post(
        `${process.env.REACT_APP_API}/api/v1/payment/create-payment-intent`,
        {
          productIds,
          amount,
          paymentMethodId: paymentMethod.id,
        }
      );

      const { clientSecret } = data;

      const { error: confirmError } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: paymentMethod.id,
        }
      );

      if (confirmError) {
        message.error(confirmError.message);
      } else {
        message.success("Payment successful!");
      }
    } catch (err) {
      console.error("Payment error:", err);
      message.error("There was an error processing your payment.");
    } finally {
      setIsProcessing(false);
    }
  };

  const displayAmount =
    cartItems && cartItems.length > 0
      ? cartItems
          .reduce(
            (total, item) => total + item.product.price * item.quantity,
            0
          )
          .toFixed(2)
      : product
      ? product.price.toFixed(2)
      : "0.00";

  return (
    <div className="payment-form-card">
      <h2 className="payment-form-title">Payment Details</h2>
      <form onSubmit={handleSubmit} className="payment-form">
        <div className="card-element-container">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: "16px",
                  color: "#424770",
                  "::placeholder": {
                    color: "#aab7c4",
                  },
                },
                invalid: {
                  color: "#9e2146",
                },
              },
            }}
          />
        </div>
        {cardError && <div className="card-error">{cardError}</div>}
        <Button
          type="primary"
          htmlType="submit"
          disabled={!stripe || isProcessing}
          loading={isProcessing}
          className="payment-form-button"
        >
          {isProcessing ? <Spin /> : `Pay $${displayAmount}`}
        </Button>
      </form>
    </div>
  );
};

export default PaymentForm;
