import { check, body } from 'express-validator';
import validatorMiddleware from '../middleware/validatorMiddleware.js';
import ApiError from '../utils/apiError.js';
import Product from '../models/productModel.js';

export const addProductToCartValidator = [
    body('productId')
        .notEmpty()
        .withMessage('Product ID is required')
        .isMongoId()
        .withMessage('Invalid Product ID format')
        .custom(async (productId) => {
            const product = await Product.findById(productId);
            if (!product) {
                return Promise.reject(new ApiError('Product not found', 404));
            }
        }),

    body('color')
        .optional()
        .isString()
        .withMessage('Color must be a string'),

    validatorMiddleware
];

export const removeCartItemValidator = [
    check('itemId')
        .isMongoId()
        .withMessage('Invalid cart item ID format'),

    validatorMiddleware
];

export const getCartValidator = [
    check('userId')
        .optional()
        .isMongoId()
        .withMessage('Invalid user ID format'),

    validatorMiddleware
];

export const applyCouponValidator = [
    check('coupon')
        .notEmpty()
        .withMessage('Coupon code is required')
        .isLength({ min: 3, max: 20 })
        .withMessage('Coupon code must be between 3 and 20 characters'),

    validatorMiddleware
];