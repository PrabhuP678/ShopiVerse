import userModel from '../models/userModel.js'; // Import the User model
import Order from '../models/orderModel.js'; // Import the Order model
import product from '../models/productModel.js';
// Controller to get all users
export const getAllUsers = async (req, res) => {
    try {
        const users = await userModel.find(); // Fetch all users
        res.status(200).json({
            success: true,
            users,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch users',
            error: error.message,
        });
    }
};

// Controller to get user profile
export const getUserProfile = async (req, res) => {
    try {
        // Fetch the user profile excluding the password
        const user = await userModel.findById(req.user._id).select('-password');

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, message: `Server Error: ${error.message}` });
    }
};

// Controller to update user profile
export const updateUserProfile = async (req, res) => {
    const { name, email, phone, address } = req.body;

    try {
        // Debugging information
        console.log('Updating user profile for user ID:', req.user._id);

        // Find the user by ID
        const user = await userModel.findById(req.user._id);

        if (!user) {
            // User not found
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Update user fields if new values are provided
        user.name = name || user.name;
        user.email = email || user.email;
        user.phone = phone || user.phone;
        user.address = address || user.address;

        // Save the updated user document
        await user.save();

        // Return success response
        res.json({ success: true, user });
    } catch (error) {
        // Log the error for debugging
        console.error('Error updating user profile:', error);

        // Return error response
        res.status(500).json({ success: false, message: `Server Error: ${error.message}` });
    }
};



// Controller to fetch orders for the authenticated user
export const getUserOrders = async (req, res) => {
    try {
        // Fetch orders for the authenticated user, including `createdAt` field
        const orders = await Order.find({ buyer: req.user._id }).populate({
            path: 'products.product',
            model: 'product' // Ensure this matches the model name
        });

        res.status(200).json({
            success: true,
            orders // `createdAt` is automatically included in the response
        });
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ message: 'Error fetching orders', error: error.message });
    }
};

