import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/auth';
import { CartProvider } from './context/CartContext';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import 'antd/dist/reset.css';

// Replace with your actual Stripe public key
const stripePromise = loadStripe("pk_test_51Pn0l2J5GQEsbZmIRhoF2loLW2QNqqGfZD5yC6fY9e0g1N0mpEfqsE2kApMFhoKXccNerauyzgwrDEZYUjx77tH700VardaTPf");

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <Elements stripe={stripePromise}>
    <CartProvider>
      <AuthProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AuthProvider>
    </CartProvider>
  </Elements>
);

reportWebVitals();
