import { param, check } from 'express-validator';
import validatorMiddleware from '../middleware/validatorMiddleware.js';
import ApiError from '../utils/apiError.js';
import Product from '../models/productModel.js';
import Review from '../models/reviewModel.js';

export const createReviewValidator = [
    check('title')
        .optional(),

    check('ratings')
        .notEmpty()
        .withMessage('Ratings value is required')
        .isFloat({ min: 1, max: 5 })
        .withMessage('Ratings value must be between 1 and 5'),

    param('productId')
        .isMongoId()
        .withMessage('Invalid Product ID format')
        .custom(async (val, { req }) => {
            const product = await Product.findById(val);
            if (!product) {
                throw new ApiError('Product not found', 400);
            }

            const existingReview = await Review.findOne({
                user: req.user._id,
                product: val
            });

            if (existingReview) {
                throw new ApiError('You already created a review for this product', 401);
            }
        }),

    validatorMiddleware
];

export const getProductReviewsValidator = [
    param('productId')
        .isMongoId()
        .withMessage('Invalid Product ID format')
        .custom(async (val, { req }) => {
            const product = await Product.findById(val);
            if (!product) {
                throw new ApiError('Product not found', 400);
            }
        }),

    validatorMiddleware
];

export const getReviewValidator = [
    param('productId')
        .isMongoId()
        .withMessage('Invalid Product ID format')
        .custom(async (val) => {
            const product = await Product.findById(val);
            if (!product) {
                throw new ApiError(`Product with ID ${val} not found`, 404);
            }
        }),

    param('reviewId')
        .isMongoId()
        .withMessage('Invalid Review ID format')
        .custom(async (val, { req }) => {
            const review = await Review.findOne({ _id: val, product: req.params.productId });
            if (!review) {
                throw new ApiError(`Review with ID ${val} not found for this product`, 404);
            }
        }),

    validatorMiddleware
];

export const updateReviewValidator = [
    param('reviewId')
        .isMongoId()
        .withMessage('Invalid Review ID format')
        .custom(async (val, { req }) => {
            const review = await Review.findById(val);
            if (!review) {
                throw new ApiError(`There is no review with this ID: ${val}`, 404);
            }

            if (review.user._id.toString() !== req.user._id.toString()) {
                throw new ApiError('You are not allowed to perform this action', 403);
            }

            if (review.product.toString() !== req.params.productId) {
                throw new ApiError('Review does not belong to the specified product', 400);
            }
        }),
    validatorMiddleware
];

export const deleteReviewValidator = [
    param('reviewId')
        .isMongoId()
        .withMessage('Invalid review ID format')
        .custom(async (val, { req }) => {
            if (req.user.role === 'admin') return true;

            const review = await Review.findById(val);
            if (!review) {
                throw new Error(`There is no review with this ID: ${val}`);
            }

            if (review.user._id.toString() !== req.user._id.toString()) {
                throw new Error('You are not allowed to perform this action');
            }
        }),

    validatorMiddleware
];