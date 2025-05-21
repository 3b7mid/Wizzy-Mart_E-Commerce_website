import { body, param } from 'express-validator';
import validatorMiddleware from '../middlewares/validatorMiddleware.js';
import ApiError from '../utils/apiError.js';
import pkg from 'google-libphonenumber';
const { PhoneNumberUtil } = pkg;
import User from '../models/userModel.js';

const phoneUtil = PhoneNumberUtil.getInstance();

export const addAddressValidator = [
    body('type')
        .notEmpty()
        .withMessage('Address type is required.')
        .isIn(['billing', 'shipping'])
        .withMessage('Type must be either "billing" or "shipping".'),

    body('firstName')
        .notEmpty()
        .withMessage('First name is required.')
        .isLength({ min: 2, max: 50 })
        .withMessage('First name must be between 2 and 50 characters.'),

    body('lastName')
        .notEmpty()
        .withMessage('Last name is required.')
        .isLength({ min: 2, max: 50 })
        .withMessage('Last name must be between 2 and 50 characters.'),

    body('companyName')
        .optional()
        .isLength({ max: 100 })
        .withMessage('Company name must be less than 100 characters.'),

    body('addressLine')
        .notEmpty()
        .withMessage('Address line is required.')
        .isLength({ min: 5, max: 200 })
        .withMessage('Address line must be between 5 and 200 characters.')
        .custom(async (val) => {
            const user = await User.findOne({ 'addresses.addressLine': val });
            if (user) {
                throw new ApiError('Address already exists', 400);
            }
            return true;
        }),

    body('country')
        .notEmpty()
        .withMessage('Country is required.'),

    body('state')
        .notEmpty()
        .withMessage('State/Region is required.'),

    body('city')
        .notEmpty()
        .withMessage('City is required.')
        .isLength({ min: 2, max: 100 })
        .withMessage('City must be between 2 and 100 characters.'),

    body('zipCode')
        .notEmpty()
        .withMessage('Postal code is required.')
        .matches(/^[A-Za-z0-9\s-]{3,10}$/)
        .withMessage('Invalid postal code format.'),

    body('email')
        .optional()
        .isEmail()
        .withMessage('Invalid email format.'),

    body('phoneNumber')
        .notEmpty()
        .withMessage('Phone number is required.')
        .custom((value) => {
            if (!/^\+\d{7,15}$/.test(value)) {
                throw new ApiError('Phone number must be in international format (e.g., +201234567890).', 400);
            }

            const number = phoneUtil.parse(value);
            if (!phoneUtil.isValidNumber(number)) {
                throw new ApiError('Invalid phone number format.', 400);
            }

            return true;
        }),

    body('addresses')
        .custom(async (_, { req }) => {
            const user = await User.findById(req.user._id);
            if (!user) {
                throw new ApiError('User not found', 404);
            }
            if (user && user.addresses.length >= 5) {
                throw new ApiError('Maximum 5 addresses allowed.', 400);
            }
            return true;
        }),

    validatorMiddleware
];

export const updateAddressValidator = [
    param('addressId')
        .isMongoId()
        .withMessage('Invalid address ID format.'),

    body('type')
        .optional()
        .notEmpty()
        .withMessage('Address type is required.')
        .isIn(['billing', 'shipping'])
        .withMessage('Type must be either "billing" or "shipping".'),

    body('firstName')
        .optional()
        .notEmpty()
        .withMessage('First name is required.')
        .isLength({ min: 2, max: 50 })
        .withMessage('First name must be between 2 and 50 characters.'),

    body('lastName')
        .optional()
        .notEmpty()
        .withMessage('Last name is required.')
        .isLength({ min: 2, max: 50 })
        .withMessage('Last name must be between 2 and 50 characters.'),

    body('companyName')
        .optional()
        .isLength({ max: 100 })
        .withMessage('Company name must be less than 100 characters.'),

    body('addressLine')
        .optional()
        .notEmpty()
        .withMessage('Address line is required.')
        .isLength({ min: 5, max: 200 })
        .withMessage('Address line must be between 5 and 200 characters.')
        .custom(async (val) => {
            const user = await User.findOne({ 'addresses.addressLine': val });
            if (user) {
                throw new ApiError('Address already exists', 400);
            }
            return true;
        }),

    body('country')
        .optional()
        .notEmpty()
        .withMessage('Country is required.'),

    body('state')
        .optional()
        .notEmpty()
        .withMessage('State/Region is required.'),

    body('city')
        .optional()
        .notEmpty()
        .withMessage('City is required.')
        .isLength({ min: 2, max: 100 })
        .withMessage('City must be between 2 and 100 characters.'),

    body('zipCode')
        .optional()
        .notEmpty()
        .withMessage('Postal code is required.')
        .matches(/^[A-Za-z0-9\s-]{3,10}$/)
        .withMessage('Invalid postal code format.'),

    body('email')
        .optional()
        .isEmail()
        .withMessage('Invalid email format.'),

    body('phoneNumber')
        .optional()
        .notEmpty()
        .withMessage('Phone number is required.')
        .custom((value) => {
            if (!/^\+\d{7,15}$/.test(value)) {
                throw new ApiError('Phone number must be in international format (e.g., +201234567890).', 400);
            }
            const number = phoneUtil.parse(value);
            if (!phoneUtil.isValidNumber(number)) {
                throw new ApiError('Invalid phone number format.', 400);
            }
            return true;
        }),

    validatorMiddleware
];

export const userOwnsAddressValidator = [
    param('addressId')
        .isMongoId()
        .withMessage('Invalid address ID format.'),

    validatorMiddleware
];