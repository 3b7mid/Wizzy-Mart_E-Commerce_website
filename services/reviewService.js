import asyncHandler from 'express-async-handler';
import ApiFeatures from '../utils/apiFeatures.js';
import ApiError from '../utils/apiError.js';
import { sanitizeReview } from '../utils/sanitizeData.js';
import calcAverageRatingsAndQuantity from '../models/reviewModel.js';
import Review from '../models/reviewModel.js';

// Nested route (Create)
export const setProductIdAndUserIdToBody = (req, res, next) => {
    if (!req.body.product) req.body.product = req.params.productId;
    if (!req.body.user) req.body.user = req.user._id;
    next();
};

// @desc    Create review
// @route   POST /api/reviews
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
// @route   GET /api/reviews
// @access  Public
export const getReviews = asyncHandler(async (req, res) => {
    const totalReviews = await Review.countDocuments();

    const features = new ApiFeatures(Review.find(), req.query)
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
// @route   GET /api/reviews/:id
// @access  Public
export const getReview = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const review = await Review.findById(id);

    if (!review) {
        return next(new ApiError(`There is no review found with this ID: ${id}`, 404));
    }

    res.status(200).json({
        data: sanitizeReview(review)
    });
});

// @desc    Create review
// @route   POST  /api/reviews
// @access  Private/Protect/User
export const updateReview = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    const review = await Review.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true
    });

    if (!review) {
        return next(new ApiError(`There is no review found with this ID: ${id}`, 404));
    }

    //await Review.calcAverageRatingsAndQuantity(review.product);

    res.status(200).json({
        data: sanitizeReview(review),
    });
});

// @desc    Delete specific review
// @route   DELETE /api/reviews/:id
// @access  Private/Protect/User-Admin
export const deleteReview = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const review = await Review.findByIdAndDelete(id);

    if (!review) {
        return next(new ApiError(`There is no review found with this ID: ${id}`, 404));
    }
    //await Review.calcAverageRatingsAndQuantity(review.product);

    res.status(204).end();
});