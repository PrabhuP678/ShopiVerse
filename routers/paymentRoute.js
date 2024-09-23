import express from 'express';
import Stripe from 'stripe';
import Product from '../models/productModel.js'; // Ensure the path is correct
import { requireSignIn } from './../middlewares/authMiddleware.js';
import dotenv from 'dotenv';
import Order from '../models/orderModel.js';
dotenv.config(); // Load environment variables

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const router = express.Router();

// Define the createPaymentIntent controller
const createPaymentIntentController = async (req, res) => {
    try {
        const { productIds } = req.body;

        // Validate the input
        if (!productIds || productIds.length === 0) {
            return res.status(400).json({ success: false, message: 'No products selected for purchase' });
        }

        // Fetch the products from the database
        const products = await Product.find({ _id: { $in: productIds } });

        // Ensure all products were found
        if (products.length !== productIds.length) {
            return res.status(404).json({ success: false, message: 'Some products not found' });
        }

        // Calculate the total amount in cents
        const totalAmount = products.reduce((total, product) => total + product.price, 0) * 100;

        // Create a payment intent with the total amount
        const paymentIntent = await stripe.paymentIntents.create({
            amount: totalAmount,
            currency: 'usd',
        });

        // Create an order document
        const order = new Order({
            buyer: req.user._id, // Assuming req.user contains the authenticated user
            products: products.map(product => ({
                product: product._id,
                quantity: 1, // Default quantity; adjust as needed
            })),
            totalPrice: totalAmount / 100, // Convert cents to dollars
            status: 'pending', // Initial status
        });

        await order.save();

        // Send the clientSecret and order ID to the client
        res.status(200).json({
            success: true,
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id, // Optional: Include payment intent ID
            orderId: order._id, // Include order ID
        });
    } catch (error) {
        console.error('Error creating payment intent:', error);
        res.status(500).json({
            success: false,
            message: 'Error processing payment',
            error: error.message,
        });
    }
};

// Define the route for creating a payment intent
router.post('/create-payment-intent', requireSignIn, createPaymentIntentController);

export default router;

