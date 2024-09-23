import Review from '../models/reviewModel.js';
import Product from '../models/productModel.js';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

// Add a review
export const addReviewController = async (req, res) => {
    try {
        const { product, title, reason, rating } = req.body;

        // Validate input
        if (!title || !reason || rating === undefined || !mongoose.Types.ObjectId.isValid(product)) {
            return res.status(400).json({ message: 'All fields are required and product must be a valid ID' });
        }

        // Create and save review
        const newReview = new Review({
            product,  // Ensure this is a valid ObjectId
            title,
            reason,
            rating
        });

        const savedReview = await newReview.save();

        res.status(201).json({
            success: true,
            review: savedReview
        });
    } catch (error) {
        console.error('Error saving review:', error);
        res.status(500).json({
            success: false,
            message: 'Error saving review',
            error: error.message
        });
    }
};

// Get reviews for a specific product
export const getReviewsByProductController = async (req, res) => {
    try {
        const { productId } = req.params;
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ message: 'Invalid product ID' });
        }
        const reviews = await Review.find({ product: productId }).populate('product');
        res.status(200).send({ success: true, reviews });
    } catch (error) {
        console.error(error);
        res.status(400).send({
            success: false,
            message: "Error getting reviews",
            error
        });
    }
};

export const getreviewController = async (req, res) => {
    try {
        const { productId } = req.params;
        const { page = 1, limit = 5 } = req.query;
        const skip = (page - 1) * limit;

        const reviews = await Review.find({ product: productId })
            .skip(parseInt(skip))
            .limit(parseInt(limit))
            .exec();

        const totalReviews = await Review.countDocuments({ product: productId });

        res.status(200).json({
            success: true,
            reviews,
            totalReviews
        });
    } catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching reviews',
            error: error.message
        });
    }
};
// Update a review
export const updateReviewController = async (req, res) => {
    try {
        const { reviewId } = req.params;
        const data = req.body;

        const updatedReview = await Review.findByIdAndUpdate(reviewId, data, { new: true });

        if (!updatedReview) {
            return res.status(404).send({
                success: false,
                message: "Review not found",
            });
        }

        res.status(200).send({
            success: true,
            message: "Review updated successfully",
            review: updatedReview,
        });
    } catch (error) {
        console.error(error);
        res.status(400).send({
            success: false,
            message: "Error updating review",
            error
        });
    }
};

// Delete a review
export const deleteReviewController = async (req, res) => {
    try {
        const { reviewId } = req.params;

        if (!reviewId) {
            return res.status(400).json({ message: 'Review ID is required' });
        }

        const review = await Review.findById(reviewId);

        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        await Review.findByIdAndDelete(reviewId);

        return res.status(200).json({ success: true, message: 'Review deleted successfully' });
    } catch (error) {
        console.error("Error deleting review:", error); // Debug: Log detailed error
        return res.status(500).json({ message: 'Error deleting review', error: error.message });
    }
};