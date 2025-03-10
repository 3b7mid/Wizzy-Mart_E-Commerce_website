import { check, body } from 'express-validator';
import validatorMiddleware from './validatorMiddleware.js';
import slugify from 'slugify';
import bcrypt from 'bcrypt';
import User from '../models/userModel.js';

export const getUserValidator = [
    check('id')
        .isMongoId()
        .withMessage('Invalid user id format'),
    validatorMiddleware
];

export const updateUserValidator = [
    check('id')
        .isMongoId()
        .withMessage('Invalid user id format'),
    body('name')
        .optional()
        .custom((val) => {
            req.body.slug = slugify(val);
            return true;
        }),
    check('email')
        .optional()
        .isEmail()
        .withMessage('Invalid email address')
        .custom(async (val) => {
            const user = await User.findOne({ email: val });
            if (user) {
                throw new Error('E-mail already in use');
            }
        }),
    validatorMiddleware
];

export const changeUserPasswordValidator = [
    check('id')
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
            const user = await User.findById(req.params.id);
            if (!user) {
                throw new Error('There is no user for this id');
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

export const deleteUserValidator = [
    check('id')
        .isMongoId()
        .withMessage('Invalid user id format'),
    validatorMiddleware,
];