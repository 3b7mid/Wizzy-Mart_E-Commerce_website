import { body, param } from 'express-validator';
import validatorMiddleware from '../middlewares/validatorMiddleware.js';
import ApiError from '../utils/apiError.js';
import Coupon from '../models/couponModel.js';
import Category from '../models/categoryModel.js';
import Product from '../models/productModel.js';

export const createCouponValidator = [
    body('code')
        .notEmpty()
        .withMessage('Coupon code is required.')
        .isString()
        .withMessage('Coupon code must be a string.')
        .isLength({ min: 3, max: 20 })
        .withMessage('Coupon code must be between 3 and 20 characters.')
        .customSanitizer((val) => {
            return val.trim().replace(/\s+/g, '_').toUpperCase();
        }),

    body('discount')
        .notEmpty()
        .withMessage('Discount value is required.')
        .isFloat({ min: 0 })
        .withMessage('Discount must be a positive number.'),

    body('type')
        .optional()
        .isIn(['percentage', 'fixed'])
        .withMessage('Type must be either percentage or fixed.'),

    body('expiresAt')
        .notEmpty()
        .withMessage('Expiration date is required.')
        .isISO8601()
        .withMessage('Invalid date format. Use ISO8601 format (YYYY-MM-DD).')
        .custom((val) => {
            if (new Date(val) <= new Date()) {
                throw new ApiError('Expiration date must be in the future.');
            }
            return true;
        }),

    body('minPurchase')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('Minimum purchase amount must be a positive number.'),

    body('maxDiscount')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('Maximum discount must be a positive number.')
        .custom((val, { req }) => {
            if (req.body.type === 'percentage' && val > 100) {
                throw new ApiError('Maximum discount cannot exceed 100% for percentage type.');
            }
            return true;
        }),

    body('categories')
        .optional()
        .isArray()
        .withMessage('Categories must be an array.')
        .custom(async (val) => {
            if (val && val.length > 0) {
                const categories = await Category.find({ _id: { $in: val } });
                if (categories.length !== val.length) {
                    throw new ApiError('One or more categories do not exist.');
                }
            }
            return true;
        }),

    body('products')
        .optional()
        .isArray()
        .withMessage('Products must be an array.')
        .custom(async (val) => {
            if (val && val.length > 0) {
                const products = await Product.find({ _id: { $in: val } });
                if (products.length !== val.length) {
                    throw new ApiError('One or more products do not exist.');
                }
            }
            return true;
        }),

    body('description')
        .optional()
        .isString()
        .withMessage('Description must be a string.')
        .isLength({ max: 500 })
        .withMessage('Description cannot exceed 500 characters.'),

    validatorMiddleware
];

export const updateCouponValidator = [
    param('couponId')
        .isMongoId()
        .withMessage('Invalid coupon ID format.'),

    body('code')
        .optional()
        .isString()
        .withMessage('Coupon code must be a string.')
        .isLength({ min: 3, max: 20 })
        .withMessage('Coupon code must be between 3 and 20 characters.')
        .custom(async (val, { req }) => {
            const coupon = await Coupon.findOne({ code: val.toUpperCase(), _id: { $ne: req.params.couponId } });
            if (coupon) {
                throw new ApiError('Coupon code already exists.');
            }
            return true;
        }),

    body('discount')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('Discount must be a positive number.'),

    body('type')
        .optional()
        .isIn(['percentage', 'fixed'])
        .withMessage('Type must be either percentage or fixed.'),

    body('expiresAt')
        .optional()
        .isISO8601()
        .withMessage('Invalid date format. Use ISO8601 format (YYYY-MM-DD).')
        .custom((val) => {
            if (new Date(val) <= new Date()) {
                throw new ApiError('Expiration date must be in the future.');
            }
            return true;
        }),

    body('minPurchase')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('Minimum purchase amount must be a positive number.'),

    body('maxDiscount')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('Maximum discount must be a positive number.')
        .custom((val, { req }) => {
            if (req.body.type === 'percentage' && val > 100) {
                throw new ApiError('Maximum discount cannot exceed 100% for percentage type.');
            }
            return true;
        }),

    body('categories')
        .optional()
        .isArray()
        .withMessage('Categories must be an array.')
        .custom(async (val) => {
            if (val && val.length > 0) {
                const categories = await Category.find({ _id: { $in: val } });
                if (categories.length !== val.length) {
                    throw new ApiError('One or more categories do not exist.');
                }
            }
            return true;
        }),

    body('products')
        .optional()
        .isArray()
        .withMessage('Products must be an array.')
        .custom(async (val) => {
            if (val && val.length > 0) {
                const products = await Product.find({ _id: { $in: val } });
                if (products.length !== val.length) {
                    throw new ApiError('One or more products do not exist.');
                }
            }
            return true;
        }),

    body('description')
        .optional()
        .isString()
        .withMessage('Description must be a string.')
        .isLength({ max: 500 })
        .withMessage('Description cannot exceed 500 characters.'),

    validatorMiddleware
];

export const CouponIDValidator = [
    param('couponId')
        .isMongoId()
        .withMessage('Invalid coupon ID format.'),

    validatorMiddleware
];
