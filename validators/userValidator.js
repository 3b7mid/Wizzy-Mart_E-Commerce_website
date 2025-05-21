import { body, param } from 'express-validator';
import validatorMiddleware from '../middlewares/validatorMiddleware.js';
import ApiError from '../utils/apiError.js';

const validRoles = ['user', 'seller', 'admin'];

export const createUserValidator = [
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

    body('role')
        .notEmpty()
        .withMessage('role is required')
        .custom((val) => {
            if (!validRoles.includes(val)) {
                throw new ApiError(`Invalid role. valid roles are: ${validRoles.join(', ')}`);
            }
            return true;
        }),

    validatorMiddleware
];

export const updateUserRoleValidator = [
    param('userId')
        .isMongoId()
        .withMessage('Invalid user ID format'),

    body('role')
        .notEmpty()
        .withMessage('role is required')
        .custom((val) => {
            if (!validRoles.includes(val)) {
                throw new ApiError(`Invalid role. valid roles are: ${validRoles.join(', ')}`, 400);
            }
            return true;
        }),

    validatorMiddleware
];

export const UserIdValidator = [
    param('userId')
        .isMongoId()
        .withMessage('Invalid user ID format'),

    validatorMiddleware
];

