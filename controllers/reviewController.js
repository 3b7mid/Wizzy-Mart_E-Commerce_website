import asyncHandler from 'express-async-handler';
import { sanitizeReview } from '../utils/sanitizeData.js';
import { createReviewService, getReviewsService, getReviewService, updateReviewService, deleteReviewService, setProductIdAndUserIdToBody } from '../services/reviewService.js';

// @desc    Create review
// @route   POST /api/products/:productId/reviews
// @access  Private/Protect/User
export const createReview = asyncHandler(async (req, res) => {
    const { productId } = req.params;

    const review = await createReviewService(req.user._id, productId, req.body);

    res.status(201).json({
        success: true,
        message: 'Review created successfully.',
        data: sanitizeReview(review)
    });
});

// @desc    Get list of reviews
// @route   GET /api/products/:productId/reviews
// @access  Public
export const getReviews = asyncHandler(async (req, res) => {
    const { totalReviews, pagination, reviews } = await getReviewsService(req.params.productId, req.query);

    res.status(200).json({
        success: true,
        results: totalReviews,
        pagination,
        data: reviews.map(sanitizeReview)
    });
});

// @desc    Get specific review by ID
// @route   GET /api/products/:productId/reviews/:reviewId
// @access  Public
export const getReview = asyncHandler(async (req, res) => {
    const { reviewId, productId } = req.params;

    const review = await getReviewService(reviewId, productId);

    res.status(200).json({
        success: true,
        data: sanitizeReview(review)
    });
});

// @desc    Update review
// @route   PUT  /api/products/:productId/reviews/:reviewId
// @access  Private/Protect/User
export const updateReview = asyncHandler(async (req, res) => {
    const { reviewId, productId } = req.params;

    const review = await updateReviewService(req.user._id, reviewId, productId, req.body);

    res.status(200).json({
        success: true,
        message: 'Review updated successfully.',
        data: sanitizeReview(review)
    });
});

// @desc    Delete specific review
// @route   DELETE /api/products/:productId/reviews/:reviewId
// @access  Private/Protect/User-Admin
export const deleteReview = asyncHandler(async (req, res) => {
    const { reviewId, productId } = req.params;

    await deleteReviewService(req.user._id, reviewId, productId);

    res.status(200).json({
        success: true,
        message: 'Review deleted successfully.'
    });
});

// Middleware to set productId and userId in request body
export const setProductIdAndUserId = (req, res, next) => {
    setProductIdAndUserIdToBody(req);
    next();
};
