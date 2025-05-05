import asyncHandler from 'express-async-handler';
import ApiFeatures from '../utils/apiFeatures.js';
import ApiError from '../utils/apiError.js';
import { sanitizeReview } from '../utils/sanitizeData.js';
import Review from '../models/reviewModel.js';
// import Product from '../models/productModel.js';

// Nested route (Create)
export const setProductIdAndUserIdToBody = (req, res, next) => {
    if (!req.body.product) req.body.product = req.params.productId;
    if (!req.body.user) req.body.user = req.user._id;
    next();
};

// @desc    Create review
// @route   POST /api/products/:productId/reviews
// @access  Private/Protect/User
export const createReview = asyncHandler(async (req, res) => {
    const { title, ratings } = req.body;
    const { productId } = req.params;
    const review = await Review.create({
        title,
        ratings,
        user: req.user._id,
        product: productId
    });

    res.status(201).json({
        data: sanitizeReview(review)
    });
});

// @desc    Get list of reviews
// @route   GET /api/products/:productId/reviews
// @access  Public
export const getReviews = asyncHandler(async (req, res) => {
    const { productId } = req.params;
    const query = productId ? Review.find({ product: productId }) : Review.find();
    const totalReviews = await Review.countDocuments(productId ? { product: productId } : {});

    const features = new ApiFeatures(query, req.query)
        .filter()
        .sort()
        .limitFields()
        .search(['title'])
        .paginate(totalReviews)

    const reviews = await features.mongooseQuery.exec();

    res.status(200).json({
        results: reviews.length,
        paginationResult: features.paginationResult,
        data: reviews.map(sanitizeReview)
    });
});

// @desc    Get specific review by ID
// @route   GET /api/products/:productId/reviews/:reviewId
// @access  Public
export const getReview = asyncHandler(async (req, res, next) => {
    const { productId, reviewId } = req.params;

    const review = await Review.findOne({ _id: reviewId, product: productId });
    if (!review) {
        return next(new ApiError(`Review with ID ${reviewId} not found for this product`, 404));
    }

    res.status(200).json({
        data: sanitizeReview(review)
    });
});

// @desc    Update review
// @route   PUT  /api/products/:productId/reviews/:reviewId
// @access  Private/Protect/User
export const updateReview = asyncHandler(async (req, res, next) => {
    const { reviewId } = req.params;

    const updatedReview = await Review.findByIdAndUpdate(reviewId, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        data: sanitizeReview(updatedReview),
    });
});

// @desc    Delete specific review
// @route   DELETE /api/products/:productId/reviews/:reviewId
// @access  Private/Protect/User-Admin
export const deleteReview = asyncHandler(async (req, res, next) => {
    const { reviewId } = req.params;
    const review = await Review.findByIdAndDelete(reviewId);

    if (!review) {
        return next(new ApiError(`There is no review found with this ID: ${reviewId}`, 404));
    }
    //await Review.calcAverageRatingsAndQuantity(review.product);

    res.status(204).end();
});