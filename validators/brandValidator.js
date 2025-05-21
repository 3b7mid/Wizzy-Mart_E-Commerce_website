import { param, body } from 'express-validator';
import slugify from 'slugify';
import validatorMiddleware from '../middlewares/validatorMiddleware.js';
import ApiError from '../utils/apiError.js';
import SubCategory from '../models/subCategoryModel.js';
import Category from '../models/categoryModel.js';
import Brand from '../models/brandModel.js';

export const createBrandValidator = [
    body('name')
        .notEmpty()
        .withMessage('Brand name is required.')
        .isLength({ min: 3, max: 32 })
        .withMessage('Brand name must be between 3 and 32 characters.')
        .custom(async (val, { req }) => {
            req.body.slug = slugify(val);
            const brand = await Brand.findOne({ name: val });
            if (brand) {
                throw new ApiError('Brand name already exists.', 400);
            }
            return true;
        }),

    body('category')
        .isMongoId()
        .withMessage('Invalid category ID format.')
        .custom(async (val) => {
            const category = await Category.findById(val);
            if (!category) {
                throw new ApiError('Category not found.', 404);
            }
            return true;
        }),

    body('subCategory')
        .optional()
        .custom(async (val) => {
            const subCategory = await SubCategory.findById(val);
            if (!subCategory) {
                throw new ApiError(`SubCategory not found.`, 404);
            }
            return true;
        }),

    validatorMiddleware
];

export const updateBrandValidator = [
    param('brandId')
        .isMongoId()
        .withMessage('Invalid brand ID format.'),

    body('name')
        .optional()
        .custom(async (val, { req }) => {
            if (val) req.body.slug = slugify(val);
            const brand = await Brand.findOne({ name: val });
            if (brand) {
                throw new ApiError('Brand name already exists.', 400);
            }
            return true;
        }),

    body('category')
        .optional()
        .isMongoId()
        .withMessage('Invalid category ID format.')
        .custom(async (val) => {
            const category = await Category.findById(val);
            if (!category) {
                throw new ApiError('Category not found.', 404);
            }
            return true;
        }),

    body('subCategory')
        .optional()
        .custom(async (val) => {
            const subCategory = await SubCategory.findById(val);
            if (!subCategory) {
                throw new ApiError(`SubCategory not found.`, 404);
            }
            return true;
        }),

    validatorMiddleware
];

export const BrandIDValidator = [
    param('brandId')
        .isMongoId()
        .withMessage('Invalid brand ID format.'),

    validatorMiddleware
];
