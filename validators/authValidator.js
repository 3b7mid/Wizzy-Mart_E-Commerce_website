import { check } from 'express-validator';
import validatorMiddleware from '../middleware/validatorMiddleware.js';
import User from '../models/userModel.js';
import ApiError from '../utils/apiError.js';

export const signupValidator = [
    check('name')
        .notEmpty()
        .withMessage('User is required')
        .isLength({ min: 3 })
        .withMessage('Too short User name'),

    check('email')
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Invalid email address')
        .custom(async (val) => {
            const user = await User.findOne({ email: val });
            if (user) {
                throw new Error('Email already in use')
            }
        }),

    check('password')
        .notEmpty()
        .withMessage('Password is required')
        .isLength({ min: 6 })
        .withMessage('Passord must be at least 6 characters')
        .custom((password, { req }) => {
            if (password !== req.body.passwordConfirm) {
                throw new Error('password confirmation incorrect');
            }
            return true;
        }),

    check('passwordConfirm')
        .notEmpty()
        .withMessage('Password confirmation required'),

    validatorMiddleware
];

export const loginValidator = [
    check('email')
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Invalid email address')
        .custom(async (val) => {
            const user = await User.findOne({ email: val })

            if (!user) {
                throw new ApiError('Incorrect email or password', 401);
            }

            if (!user.isVerified) {
                throw new ApiError('Please verify your email before logging in', 400);
            }

            return true;
        }),

    check('password')
        .notEmpty()
        .withMessage('Password is required')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters'),

    validatorMiddleware
];