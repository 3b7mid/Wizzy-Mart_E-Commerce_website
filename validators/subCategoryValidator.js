import { param, body } from 'express-validator';
import slugify from 'slugify';
import validatorMiddleware from '../middlewares/validatorMiddleware.js';
import ApiError from '../utils/apiError.js';
import Category from '../models/categoryModel.js';
import SubCategory from '../models/subCategoryModel.js';

export const createSubCategoryValidator = [
    body('name')
        .notEmpty()
        .withMessage('SubCategory name is required.')
        .isLength({ min: 3, max: 32 })
        .withMessage('SubCategory name must be between 3 and 32 characters.')
        .custom(async (val, { req }) => {
            req.body.slug = slugify(val);
            const subCategory = await SubCategory.findOne({ name: val });
            if (subCategory) {
                throw new ApiError('subcategory name already exist.', 400);
            }
            return true;
        }),

    body('category')
        .notEmpty()
        .withMessage('subCategory must belong to category.')
        .isMongoId()
        .withMessage('Invalid Category ID format')
        .custom(async (categoryId) => {
            const category = await Category.findById(categoryId);
            if (!category) {
                throw new ApiError('Category not found.', 404);
            }
            return true;
        }),

    validatorMiddleware
];

export const updateSubCategoryValidator = [
    param('subcategoryId')
        .isMongoId()
        .withMessage('Invalid subCategory ID format'),

    body('name')
        .optional()
        .custom(async (val, { req }) => {
            req.body.slug = slugify(val);
            const subCategory = await SubCategory.findOne({ name: val });
            if (subCategory) {
                throw new ApiError('subcategory name already exist.', 400);
            }
            return true;
        }),

    body('category')
        .optional()
        .isMongoId()
        .withMessage('Invalid Category ID format')
        .custom(async (categoryId) => {
            const category = await Category.findById(categoryId);
            if (!category) {
                throw new ApiError('Category not found.', 404);
            }
            return true;
        }),

    validatorMiddleware
];

export const SubCategoryIDValidator = [
    param('subcategoryId')
        .isMongoId()
        .withMessage('Invalid subCategory ID format.'),

    validatorMiddleware
];