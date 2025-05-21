import { body, param } from 'express-validator';
import validatorMiddleware from '../middlewares/validatorMiddleware.js';

export const createOrderValidator = [
    param('cartId')
        .isMongoId()
        .withMessage('Invalid cart ID format.'),
        
    body('billingInfo')
        .notEmpty()
        .withMessage('Billing information is required'),

    body('billingInfo.firstName')
        .notEmpty()
        .withMessage('First name is required'),

    body('billingInfo.lastName')
        .notEmpty()
        .withMessage('Last name is required'),
    body('billingInfo.company')
        .optional()
        .isString()
        .withMessage('Company name must be a string'),

    body('billingInfo.addressLine')
        .notEmpty()
        .withMessage('Address line is required')
        .isLength({ min: 5 })
        .withMessage('Address line must be at least 5 characters long'),

    body('billingInfo.country')
        .notEmpty()
        .withMessage('Country is required'),

    body('billingInfo.state')
        .notEmpty()
        .withMessage('State is required'),

    body('billingInfo.city')
        .notEmpty()
        .withMessage('City is required'),

    body('billingInfo.zipCode')
        .notEmpty()
        .withMessage('Zip code is required'),

    body('billingInfo.email')
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Invalid email format'),

    body('billingInfo.phoneNumber')
        .notEmpty()
        .withMessage('Phone number is required')
        .isMobilePhone()
        .withMessage('Invalid phone number format'),

    body('orderNotes')
        .optional()
        .notEmpty()
        .withMessage('Order notes is required')
        .isString()
        .withMessage('Order notes must be a string'),

    body('paymentMethodType')
        .notEmpty()
        .withMessage('Payment method type is required')
        .isIn(['card', 'cash'])
        .withMessage('Payment method type must be either card or cash'),

    validatorMiddleware
];

export const orderIDValidator = [
    param('orderId')
        .isMongoId()
        .withMessage('Invalid User ID format.'),

    validatorMiddleware
];