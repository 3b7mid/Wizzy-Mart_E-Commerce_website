import { check } from 'express-validator';
import validatorMiddleware from './validatorMiddleware.js';

export const createOrderValidator = [
    check('shippingAddress.address')
        .notEmpty()
        .withMessage('Address is required')
        .isLength({ min: 5 }),

    check('shippingAddress.phone')
        .notEmpty()
        .withMessage('Phone number is required')
        .isMobilePhone('ar-EG')
        .withMessage('Invalid phone number format'),

    check('shippingAddress.city')
        .notEmpty()
        .withMessage('City is required'),

    check('cartItems')
        .isArray({ min: 1 })
        .withMessage('At least one product is required'),

    check('cartItems.*.product')
        .notEmpty()
        .withMessage('Product ID is required')
        .isMongoId()
        .withMessage('Invalid product ID format'),

    check('cartItems.*.amount')
        .notEmpty()
        .withMessage('Product amount is required')
        .isInt({ min: 1, max: 100 })
        .withMessage('Product amount must be a positive number between 1 and 100'),

    validatorMiddleware
];

export const updateOrderValidator = [
    check('id')
        .isMongoId()
        .withMessage('Invalid User ID format'),

    validatorMiddleware
];

export const deleteOrderValidator = [
    check('orderId')
        .isMongoId()
        .withMessage('Invalid order ID format'),

    validatorMiddleware
];

export const updateShippingPriceValidator = [
    check('shippingPrice')
        .notEmpty()
        .withMessage('Shipping price is required')
        .isFloat({ min: 0 })
        .withMessage('Shipping price must be a positive number'),

    validatorMiddleware
];