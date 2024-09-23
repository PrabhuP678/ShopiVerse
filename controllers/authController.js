import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';
import { comparePassword, hashPassword } from '../helpers/authHelper.js';
import orderModel from '../models/orderModel.js';
// Register Controller
export const registerController = async (req, res) => {
    console.log('Register request body:', req.body); // Log incoming data
    try {
        const { name, email, password, phone, address, answer } = req.body;

        // Check for missing fields
        if (!name || !email || !password || !phone || !address || !answer) {
            return res.status(400).send({ message: 'All fields are required' });
        }

        // Check if user already exists
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).send({
                success: false,
                message: 'User already exists. Please login.',
            });
        }

        const hashedPassword = await hashPassword(password);
        const user = new userModel({ name, email, phone, address, password: hashedPassword, answer });
        await user.save();

        //    jconsole.log('User saved:', user);

        res.status(201).send({
            success: true,
            message: 'User registered successfully',
            user,
        });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).send({
            success: false,
            message: 'Error during registration',
            error: error.message,
        });
    }
};

// Login Controller
export const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).send({
                success: false,
                message: 'Email and password are required',
            });
        }

        // Check if user exists
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).send({
                success: false,
                message: 'Email is not registered',
            });
        }

        // Check password
        const match = await comparePassword(password, user.password);
        if (!match) {
            return res.status(400).send({
                success: false,
                message: 'Invalid password',
            });
        }

        // Generate token
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.status(200).send({
            success: true,
            message: 'Login successful',
            user: {
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                role: user.role,
            },
            token,
        });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).send({
            success: false,
            message: 'Error in login',
            error: error.message,
        });
    }
};

// Test Controller (protected route)
export const testController = (req, res) => {
    try {
        res.status(200).send('Protected route accessed');
    } catch (error) {
        console.error('Error in testController:', error);
        res.status(500).send('Server error');
    }
};

// Forgot Password Controller
export const forgotPasswordController = async (req, res) => {
    try {
        const { email, answer, newPassword } = req.body;

        // Validate input
        if (!email || !answer || !newPassword) {
            return res.status(400).send({ message: 'All fields are required' });
        }

        // Find user
        const user = await userModel.findOne({ email, answer });
        if (!user) {
            return res.status(404).send({
                success: false,
                message: 'Invalid email or answer',
            });
        }

        // Hash new password and update user
        const hashedPassword = await hashPassword(newPassword);
        await userModel.findByIdAndUpdate(user._id, { password: hashedPassword });

        res.status(200).send({
            success: true,
            message: 'Password updated successfully',
        });
    } catch (error) {
        console.error('Error during password reset:', error);
        res.status(500).send({
            success: false,
            message: 'Something went wrong',
            error: error.message,
        });
    }
};


export const refreshToken = async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) return res.status(401).json({ message: 'Refresh token is required' });

    try {
        const decoded = JWT.verify(refreshToken, process.env.JWT_SECRET);
        const newAccessToken = JWT.sign({ _id: decoded._id, role: decoded.role }, process.env.JWT_SECRET, { expiresIn: '15m' });

        res.json({ accessToken: newAccessToken });
    } catch (error) {
        return res.status(401).json({ message: 'Invalid or expired refresh token' });
    }
};

// orders
export const getOrdersController = async (req, res) => {
    try {
        // Find orders for the authenticated user and populate related fields
        const orders = await orderModel.find({ buyer: req.user._id })
            .populate('buyer', 'name email photo')  // Populating with name, email, and photo of the buyer
            .populate('products.product', 'name price image'); // Optionally populate product details

        res.status(200).send({
            success: true,
            message: 'Orders fetched successfully',
            orders,
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Something went wrong',
            error: error.message,
        });
    }
};