import { check, body } from 'express-validator';
import validatorMiddleware from '../middleware/validatorMiddleware.js';
import bcrypt from 'bcrypt';
import User from '../models/userModel.js';

export const getUserValidator = [
    check('id')
        .isMongoId()
        .withMessage('Invalid user id format'),
    validatorMiddleware
];

export const deleteUserValidator = [
    check('id')
        .isMongoId()
        .withMessage('Invalid user id format'),
    validatorMiddleware,
];

export const changeUserPasswordValidator = [
    check('userId')
        .isMongoId()
        .withMessage('Invalid user id format'),

    body('currentPassword')
        .notEmpty()
        .withMessage('You must enter your current password'),

    body('passwordConfirm')
        .notEmpty()
        .withMessage('You must enter the password confirm'),

    body('password')
        .notEmpty()
        .withMessage('You must enter new password')
        .custom(async (val, { req }) => {
            const user = await User.findById(req.params.userId);
            if (!user) {
                throw new Error('User not found');
            }

            const isCorrectPassword = await bcrypt.compare(
                req.body.currentPassword,
                user.password
            );

            if (!isCorrectPassword) {
                throw new Error('Incorrect current password');
            }

            if (val !== req.body.passwordConfirm) {
                throw new Error('Password Confirmation incorrect');
            }

            return true;
        }),
    validatorMiddleware
];

