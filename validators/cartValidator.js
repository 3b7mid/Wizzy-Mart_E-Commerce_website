import { param, body } from 'express-validator';
import validatorMiddleware from '../middlewares/validatorMiddleware.js';

export const addProductToCartValidator = [
    body('productId')
        .notEmpty()
        .withMessage('Product ID is required.')
        .isMongoId()
        .withMessage('Invalid Product ID format.'),

    body('color')
        .notEmpty()
        .withMessage('Color is required.')
        .isString()
        .withMessage('Color must be a string.'),

    body('amount')
        .notEmpty()
        .withMessage('Amount is required')
        .isInt({ min: 1, max: 100 })
        .withMessage('Amount must be an integer between 1 and 100'),

    validatorMiddleware
];

export const updateCartItemValidator = [
    param('itemId')
        .isMongoId()
        .withMessage('Invalid cart item ID format.'),

    body('amount')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('Amount must be between 1 and 100.'),

    body('color')
        .optional()
        .isString()
        .withMessage('Color must be a string.'),

    validatorMiddleware
];

export const removeCartItemValidator = [
    param('itemId')
        .isMongoId()
        .withMessage('Invalid cart item ID format.'),

    validatorMiddleware
];

export const clearCartValidator = [
    param('cartId')
        .isMongoId()
        .withMessage('Invalid cart ID format.'),

    validatorMiddleware
];

export const applyCouponValidator = [
    body('coupon')
        .notEmpty()
        .withMessage('Coupon code is required.'),

    validatorMiddleware
];