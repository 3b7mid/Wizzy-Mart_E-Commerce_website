import { check, body } from 'express-validator';
import slugify from 'slugify';
import validatorMiddleware from '../middleware/validatorMiddleware.js';
import ApiError from '../utils/apiError.js';
import SubCategory from '../models/subCategoryModel.js';
import Category from '../models/categoryModel.js';

export const getBrandValidator = [
    check('id')
        .isMongoId()
        .withMessage('Invalid brand ID format'),

    validatorMiddleware
];

export const createBrandValidator = [
    body('name')
        .notEmpty()
        .withMessage('Brand name is required')
        .isLength({ min: 3 })
        .withMessage('Brand name must be at least 3 characters long')
        .isLength({ max: 32 })
        .withMessage('Brand name must be at most 32 characters long')
        .custom((val, { req }) => {
            req.body.slug = slugify(val);
            return true;
        }),

    check('category')
        .isMongoId()
        .withMessage('Invalid category ID format')
        .custom(async (categoryId) => {
            const category = await Category.findById(categoryId);
            if (!category) {
                return Promise.reject(new ApiError('Category not found', 404));
            }
        }),

    check('subCategories')
        .optional()
        .isArray()
        .withMessage('Subcategories must be an array')
        .custom(async (subCategories) => {
            for (const subCategoryId of subCategories) {
                const subCategory = await SubCategory.findById(subCategoryId);
                if (!subCategory) {
                    return Promise.reject(new ApiError(`SubCategory not found: ${subCategoryId}`, 404));
                }
            }
        }),

    validatorMiddleware
];

export const updateBrandValidator = [
    check('id')
        .isMongoId()
        .withMessage('Invalid brand ID format'),

    body('name')
        .optional()
        .custom((val, { req }) => {
            if (val) req.body.slug = slugify(val);
            return true;
        }),

    validatorMiddleware
];

export const deleteBrandValidator = [
    check('id')
        .isMongoId()
        .withMessage('Invalid brand ID format'),

    validatorMiddleware
];