import { check } from 'express-validator';
import validatorMiddleware from '../middleware/validatorMiddleware.js';
import User from '../models/userModel.js';

export const addAddressValidator = [
    check('alias')
        .notEmpty()
        .withMessage('Alias is required')
        .isLength({ min: 4, max: 50 })
        .withMessage('Alias must be between 4 and 50 characters')
        .trim()
        .custom(async (alias, { req }) => {
            const user = await User.findById(req.user._id);
            if (user && user.addresses.some(address => address.alias === alias)) {
                return Promise.reject(
                    new Error(`Alias ${alias} is already used`)
                );
            }
        }),

    check('details')
        .notEmpty()
        .withMessage('Address details are required')
        .isLength({ min: 5, max: 200 })
        .withMessage('Address details must be between 5 and 200 characters'),

    check('phone')
        .notEmpty()
        .withMessage('Phone number is required')
        .isMobilePhone('ar-EG')
        .withMessage('Invalid phone number format'),

    check('city')
        .notEmpty()
        .withMessage('City is required')
        .isLength({ min: 4, max: 100 })
        .withMessage('City must be between 2 and 100 characters')
        .trim(),

    check('postalCode')
        .notEmpty()
        .withMessage('Postal code is required')
        .matches(/^[A-Za-z0-9\s-]{3,10}$/)
        .withMessage('Invalid postal code format')
        .trim(),

    check('addresses')
        .custom(async (val, { req }) => {
            const user = await User.findById(req.user._id);
            if (user && user.addresses.length >= 5) {
                return Promise.reject(
                    new Error('Maximum 5 addresses allowed')
                );
            }
        }),

    validatorMiddleware
];

export const removeAddressValidator = [
    check('addressId')
        .isMongoId()
        .withMessage('Invalid address ID format')
        .custom(async (addressId, { req }) => {
            const user = await User.findById(req.user._id);
            if (!user) {
                return Promise.reject(
                    new Error(`User not found`)
                );
            }
            if (!user.addresses.some(address => address._id.toString() === addressId)) {
                return Promise.reject(
                    new Error(`No address found with ID: ${addressId}`)
                );
            }
        }),

    validatorMiddleware
];