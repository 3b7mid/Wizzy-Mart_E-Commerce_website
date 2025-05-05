import { check } from 'express-validator';
import validatorMiddleware from '../middleware/validatorMiddleware.js';

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

    validatorMiddleware
];

export const updateOrderValidator = [
    check('orderId')
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

export const checkoutSessionValidator = [
    check('cartId')
        .isMongoId()
        .withMessage('Invalid cart ID format'),

    check('shippingAddress.address')
        .notEmpty()
        .withMessage('Address is required')
        .isLength({ min: 5 })
        .withMessage('Address must be at least 5 characters long'),

    check('shippingAddress.phone')
        .notEmpty()
        .withMessage('Phone number is required')
        .isMobilePhone('ar-EG')
        .withMessage('Invalid phone number format'),

    check('shippingAddress.city')
        .notEmpty()
        .withMessage('City is required'),

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