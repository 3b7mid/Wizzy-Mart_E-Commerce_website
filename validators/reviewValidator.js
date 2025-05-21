import { param, body } from 'express-validator';
import validatorMiddleware from '../middlewares/validatorMiddleware.js';
import ApiError from '../utils/apiError.js';
import Product from '../models/productModel.js';
import Review from '../models/reviewModel.js';
import Order from '../models/orderModel.js';

export const createReviewValidator = [
    body('ratings')
        .notEmpty()
        .withMessage('Ratings value is required.')
        .isFloat({ min: 1, max: 5 })
        .withMessage('Ratings value must be between 1 and 5.'),

    body('feedback')
        .notEmpty()
        .withMessage('Feedback is required.'),

    param('productId')
        .isMongoId()
        .withMessage('Invalid Product ID format.')
        .custom(async (val, { req }) => {
            const product = await Product.findById(val);
            if (!product) {
                throw new ApiError('Product not found.', 404);
            }
            const existingReview = await Review.findOne({
                user: req.user._id,
                product: val
            });
            if (existingReview) {
                throw new ApiError('You have already reviewed this product.', 400);
            }
            const order = await Order.findOne({
                user: req.user._id,
                'cartItems.product': val,
                status: 'delivered'
            });
            if (!order) {
                throw new ApiError('You must purchase and receive this product before reviewing it.', 403);
            }
            return true;
        }),

    validatorMiddleware
];

export const getProductReviewsValidator = [
    param('productId')
        .isMongoId()
        .withMessage('Invalid Product ID format.')
        .custom(async (val) => {
            const product = await Product.findById(val);
            if (!product) {
                throw new ApiError('Product not found.', 404);
            }
            return true;
        }),

    validatorMiddleware
];

export const getReviewValidator = [
    param('productId')
        .isMongoId()
        .withMessage('Invalid Product ID format.')
        .custom(async (val) => {
            const product = await Product.findById(val);
            if (!product) {
                throw new ApiError('Product not found.', 404);
            }
            return true;
        }),

    param('reviewId')
        .isMongoId()
        .withMessage('Invalid Review ID format.'),

    validatorMiddleware
];

export const updateReviewValidator = [
    param('productId')
        .isMongoId()
        .withMessage('Invalid Product ID format.')
        .custom(async (val) => {
            const product = await Product.findById(val);
            if (!product) {
                throw new ApiError('Product not found.', 404);
            }
            return true;
        }),

    param('reviewId')
        .isMongoId()
        .withMessage('Invalid Review ID format.'),

    body('ratings')
        .optional()
        .isFloat({ min: 1, max: 5 })
        .withMessage('Ratings value must be between 1 and 5.'),

    body('feedback')
        .optional(),

    validatorMiddleware
];

export const deleteReviewValidator = [
    param('productId')
        .isMongoId()
        .withMessage('Invalid Product ID format.')
        .custom(async (val) => {
            const product = await Product.findById(val);
            if (!product) {
                throw new ApiError('Product not found.', 404);
            }
            return true;
        }),

    param('reviewId')
        .isMongoId()
        .withMessage('Invalid Review ID format.'),

    validatorMiddleware
];