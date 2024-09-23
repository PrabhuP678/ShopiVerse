import express from 'express';
import { isAdmin, requireSignIn } from './../middlewares/authMiddleware.js';
import { deleteReviewController, addReviewController, updateReviewController, getreviewController } from '../controllers/reviewController.js';

const router = express.Router();

// Add a review
router.post('/create-review', requireSignIn, addReviewController);

// Get reviews for a specific product
// router.get('/get-reviews/:productId', getReviewsByProductController);

router.get('/get-reviews/:productId', getreviewController);

// Update a review
router.put('/update-review/:reviewId', requireSignIn, updateReviewController);

// Delete a review
router.delete('/delete-review/:reviewId', requireSignIn, deleteReviewController);

export default router;
