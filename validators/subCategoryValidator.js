import { check, body } from 'express-validator';
import slugify from 'slugify';
import validatorMiddleware from '../middleware/validatorMiddleware.js';
import ApiError from '../utils/apiError.js';
import Category from '../models/categoryModel.js';

export const getSubCategoryValidator = [
    check('id')
        .isMongoId()
        .withMessage('Invalid subCategory ID format'),

    validatorMiddleware
];

export const createSubCategoryValidator = [
    body('name')
        .notEmpty()
        .withMessage('Category ID is required')
        .notEmpty()
        .withMessage('SubCategory name is required')
        .isLength({ min: 3 })
        .withMessage('SubCategory name must be at least 3 characters long')
        .isLength({ max: 32 })
        .withMessage('SubCategory name must be at most 32 characters long')
        .custom((val, { req }) => {
            req.body.slug = slugify(val);
            return true;
        }),

    check('category')
        .isMongoId()
        .withMessage('Invalid subCategory ID format')
        .custom(async (categoryId) => {
            const category = await Category.findById(categoryId);
            if (!category) {
                throw new ApiError('Category not found');
            }
        }),

    validatorMiddleware
];

export const updateSubCategoryValidator = [
    check('id')
        .isMongoId()
        .withMessage('Invalid subCategory ID format'),

    body('name')
        .optional()
        .custom((val, { req }) => {
            req.body.slug = slugify(val);
            return true;
        }),

    validatorMiddleware
];

export const deleteSubCategoryValidator = [
    check('id')
        .isMongoId()
        .withMessage('Invalid subCategory ID format'),

    validatorMiddleware
];