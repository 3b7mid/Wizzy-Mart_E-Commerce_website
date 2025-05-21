import { body, param } from 'express-validator';
import slugify from 'slugify';
import validatorMiddleware from '../middlewares/validatorMiddleware.js';
import ApiError from '../utils/apiError.js';
import Category from '../models/categoryModel.js';

export const createCategoryValidator = [
    body('name')
        .notEmpty()
        .withMessage('Category name is required.')
        .isLength({ min: 3, max: 32 })
        .withMessage('Category name must be between 3 and 32 characters.')
        .custom(async (val, { req }) => {
            req.body.slug = slugify(val);
            const category = await Category.findOne({ name: val });
            if (category) {
                throw new ApiError('Category name already exists.', 400);
            }
            return true;
        }),

    body('categoryImage')
        .notEmpty()
        .withMessage('Category image is required.'),

    validatorMiddleware
];

export const updateCategoryValidator = [
    param('categoryId')
        .isMongoId()
        .withMessage('Invalid category ID format.'),

    body('name')
        .optional()
        .custom(async (val, { req }) => {
            req.body.slug = slugify(val);
            const category = await Category.findOne({ name: val });
            if (category) {
                throw new ApiError('Category name already exists.', 400);
            }
            return true;
        }),

    validatorMiddleware
];

export const CategoryIDValidator = [
    param('categoryId')
        .isMongoId()
        .withMessage('Invalid category ID format.'),

    validatorMiddleware
];