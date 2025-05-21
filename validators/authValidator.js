import { body } from 'express-validator';
import validatorMiddleware from '../middlewares/validatorMiddleware.js';
import pkg from 'google-libphonenumber';
const { PhoneNumberUtil } = pkg;
import ApiError from '../utils/apiError.js';

export const signupValidator = [
    body('name')
        .notEmpty()
        .withMessage('Name is required.')
        .isLength({ min: 3, max: 50 })
        .withMessage('name must be between 3 and 50 characters.'),

    body('email')
        .notEmpty()
        .withMessage('Email is required.')
        .isEmail()
        .withMessage('Invalid email address.'),

    body('password')
        .notEmpty()
        .withMessage('Password is required.')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters.')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/)
        .withMessage('Password must include uppercase, lowercase, and a number.'),

    body('confirmPassword')
        .notEmpty()
        .withMessage('Password confirmation is required.')
        .custom((val, { req }) => {
            if (val !== req.body.password) {
                throw new ApiError('Passwords do not match.', 400);
            }
            return true;
        }),

    validatorMiddleware
];

export const resendVerificationCodeValidator = [
    body('email')
        .notEmpty()
        .withMessage('Email is required.'),

    validatorMiddleware
];

export const verifyEmailValidator = [
    body('verificationCode')
        .notEmpty()
        .withMessage('Verification code required.')
        .isLength({ min: 6, max: 6 })
        .withMessage('The Verification code must be exactly 6 digits.'),

    validatorMiddleware
];

export const loginValidator = [
    body('email')
        .notEmpty()
        .withMessage('Email is required.')
        .isEmail()
        .withMessage('Invalid email address.'),

    body('password')
        .notEmpty()
        .withMessage('Password is required.')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters.'),

    validatorMiddleware
];

export const forgetPasswordValidator = [
    body('email')
        .notEmpty()
        .withMessage('Email is required.'),

    validatorMiddleware
];

export const resetPasswordValidator = [
    body('resetCode')
        .notEmpty()
        .withMessage('Reset code required')
        .isLength({ min: 6, max: 6 })
        .withMessage('The reset code must be exactly 6 digits.'),

    body('password')
        .notEmpty()
        .withMessage('Password is required.')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters.')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/)
        .withMessage('Password must include uppercase, lowercase, and a number.'),

    body('confirmPassword')
        .notEmpty()
        .withMessage('Password confirmation is required.')
        .custom((val, { req }) => {
            if (val !== req.body.password) {
                throw new ApiError('Passwords do not match.', 400);
            }
            return true;
        }),

    validatorMiddleware
];

export const changeUserPasswordValidator = [
    body('currentPassword')
        .notEmpty()
        .withMessage('You must enter your current password'),

    body('newPassword')
        .notEmpty()
        .withMessage('You must enter new password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters.')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/)
        .withMessage('Password must include uppercase, lowercase, and a number.'),

    body('confirmPassword')
        .notEmpty()
        .withMessage('You must confirm the new password')
        .custom((val, { req }) => {
            if (val !== req.body.newPassword) {
                throw new ApiError('Passwords do not match.', 400);
            }
            return true;
        }),

    validatorMiddleware
];

const phoneUtil = PhoneNumberUtil.getInstance();

export const updateUserValidator = [
    body('displayName')
        .optional()
        .isLength({ min: 3, max: 50 })
        .withMessage('Display name must be between 3 and 50 characters.'),

    body('userName')
        .optional()
        .isLength({ min: 3, max: 50 })
        .withMessage('Username must be between 3 and 50 characters.'),

    body('fullName')
        .optional()
        .isLength({ min: 3, max: 100 })
        .withMessage('Full name must be between 3 and 100 characters.'),

    body('email')
        .optional()
        .isEmail()
        .withMessage('Invalid email address.'),

    body('secondaryEmail')
        .optional()
        .isEmail()
        .withMessage('Invalid secondary email address.'),

    body('phoneNumber')
        .optional()
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

    body('country')
        .optional()
        .isLength({ min: 2, max: 100 })
        .withMessage('Country must be between 2 and 100 characters.'),

    body('states')
        .optional()
        .isLength({ min: 2, max: 100 })
        .withMessage('State must be between 2 and 100 characters.'),

    body('zipCode')
        .optional()
        .matches(/^[0-9]{5}(?:-[0-9]{4})?$/)
        .withMessage('Invalid zip code format.'),

    validatorMiddleware
];