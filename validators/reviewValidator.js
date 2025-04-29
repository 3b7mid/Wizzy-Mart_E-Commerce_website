import { check } from 'express-validator';
import validatorMiddleware from '../middleware/validatorMiddleware.js';
import Review from '../models/reviewModel.js';

export const createReviewValidator = [
    check('title')
        .optional(),

    check('ratings')
        .notEmpty()
        .withMessage('ratings value is required')
        .isFloat({ min: 1, max: 5 })
        .withMessage('Ratings value must be between 1 and 5'),

    check('user')
        .isMongoId()
        .withMessage('Invalid User ID format'),

    check('product')
        .isMongoId()
        .withMessage('Invalid Product ID format')
        .custom(async (val, { req }) => {
            const review = await Review.findOne({ user: req.user._id, product: req.body.product });
            if (review) {
                throw new Error('You already create a review before');
            }
        }),

    validatorMiddleware
];

export const getReviewValidator = [
    check('id')
        .isMongoId()
        .withMessage('Invalid Review ID format'),

    validatorMiddleware
];

export const updateReviewValidator = [
    check('id')
        .isMongoId()
        .withMessage('Invalid Review ID format')
        .custom(async (val, { req }) => {
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

export const deleteReviewValidator = [
    check('id')
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