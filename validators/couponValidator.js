import { check } from 'express-validator';
import validatorMiddleware from '../middleware/validatorMiddleware.js';
import Coupon from '../models/couponModel.js';

export const getCouponValidator = [
    check('couponId')
        .isMongoId()
        .withMessage('Invalid coupon ID format'),

    validatorMiddleware
];

export const createCouponValidator = [
    check('code')
        .notEmpty()
        .withMessage('Coupon code is required')
        .isString()
        .withMessage('Coupon code must be a string')
        .isLength({ min: 3, max: 20 })
        .withMessage('Coupon code must be between 3 and 20 characters')
        .custom(async (val) => {
            const user = await Coupon.findOne({ code: val });
            if (user) {
                throw new Error('Coupon code already exists');
            }
        }),

    check('discount')
        .notEmpty()
        .withMessage('Discount percentage is required')
        .isFloat({ min: 1, max: 100 })
        .withMessage('Discount must be a percentage between 1 and 100'),

    check('expiresAt')
        .notEmpty()
        .withMessage('Expiration date is required')
        .isISO8601()
        .withMessage('Invalid date format. Use ISO8601 format (YYYY-MM-DD)'),

    validatorMiddleware
];

export const updateCouponValidator = [
    check('couponId')
        .isMongoId()
        .withMessage('Invalid coupon ID format'),

    check('code')
        .optional()
        .isString()
        .withMessage('Coupon code must be a string')
        .isLength({ min: 3, max: 20 })
        .withMessage('Coupon code must be between 3 and 20 characters'),

    check('discount')
        .optional()
        .isFloat({ min: 1, max: 100 })
        .withMessage('Discount must be a percentage between 1 and 100'),

    check('expiresAt')
        .optional()
        .isISO8601()
        .withMessage('Invalid date format. Use ISO8601 format (YYYY-MM-DD)'),

    validatorMiddleware
];

export const deleteCouponValidator = [
    check('couponId')
        .isMongoId()
        .withMessage('Invalid coupon ID format'),

    validatorMiddleware
];
