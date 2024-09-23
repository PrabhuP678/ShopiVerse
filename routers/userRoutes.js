import express from 'express';
import { getAllUsers, getUserOrders, getUserProfile, updateUserProfile } from '../controllers/userControllers.js';
import { isAdmin, requireSignIn } from '../middlewares/authMiddleware.js';
import { getOrdersController } from '../controllers/authController.js';

const router = express.Router();

// Route to get the user profile
router.get('/profile', requireSignIn, getUserProfile);
router.get('/admin/users', requireSignIn, isAdmin, getAllUsers);
// Route to update the user profile
router.put('/profile', requireSignIn, updateUserProfile);
router.get('/orders', requireSignIn, getUserOrders)

export default router;
