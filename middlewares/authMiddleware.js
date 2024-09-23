import jwt from 'jsonwebtoken';
import userModel from "../models/userModel.js";

export const requireSignIn = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Authorization header is missing or invalid' });
        }

        const token = authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: 'Token is missing' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach user information to request
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token has expired' });
        } else if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Invalid token' });
        } else {
            return res.status(401).json({ message: 'Authorization error', error: error.message });
        }
    }
};

export const isAdmin = async (req, res, next) => {
    try {
        const user = await userModel.findById(req.user._id);
        if (!user || user.role !== 1) {
            return res.status(403).json({ success: false, message: 'Unauthorized access' });
        }
        next();
    } catch (error) {
        console.log("Admin Middleware Error:", error);
        return res.status(500).json({ success: false, message: 'Error in admin middleware', error: error.message });
    }
};
