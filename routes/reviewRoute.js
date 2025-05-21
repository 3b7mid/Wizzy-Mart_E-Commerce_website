import express from 'express';
import { protect, allowedTo } from '../middlewares/authMiddleware.js';
import { createReviewValidator, updateReviewValidator, getReviewValidator, deleteReviewValidator, getProductReviewsValidator } from '../validators/reviewValidator.js';
import { getReviews, getReview, createReview, updateReview, deleteReview, setProductIdAndUserId } from '../controllers/reviewController.js';

const router = express.Router({ mergeParams: true });

router.route('/')
    .get(getProductReviewsValidator, getReviews)
    .post(protect, allowedTo('user'), setProductIdAndUserId, createReviewValidator, createReview);

router.route('/:reviewId')
    .get(getReviewValidator, getReview)
    .put(protect, allowedTo('user'), updateReviewValidator, updateReview)
    .delete(protect, allowedTo('admin', 'user'), deleteReviewValidator, deleteReview);

export default router;