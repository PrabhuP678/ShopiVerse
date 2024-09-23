import express from 'express';
import { registerController, loginController, testController, forgotPasswordController, refreshToken, getOrdersController } from '../controllers/authController.js';
import { requireSignIn, isAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/register', registerController);         // Register new user
router.post('/login', loginController);               // User login
router.post('/forgot-password', forgotPasswordController); // Forgot password
router.post('/refresh-token', refreshToken);

router.get('/test', requireSignIn, isAdmin, testController); // Test route with middleware

// Protected routes
router.get('/user-auth', requireSignIn, (req, res) => {
    res.status(200).send({ ok: true });
});

router.get('/admin-auth', requireSignIn, isAdmin, (req, res) => {
    res.status(200).send({ ok: true });
});



router.get('/orders', requireSignIn, getOrdersController);


export default router;
