import { check, body } from 'express-validator';
import slugify from 'slugify';
import validatorMiddleware from './validatorMiddleware.js';

export const getCategoryValidator = [
    check('id')
        .isMongoId()
        .withMessage('Invalid category ID format'),

    validatorMiddleware
];

export const createCategoryValidator = [
    body('name')
        .notEmpty()
        .withMessage('Category name is required')
        .isLength({ min: 3 })
        .withMessage('Category name must be at least 3 characters long')
        .isLength({ max: 32 })
        .withMessage('Category name must be at most 32 characters long')
        .custom((val, { req }) => {
            req.body.slug = slugify(val);
            return true;
        }),

    body('categoryImage')
        .notEmpty()
        .withMessage('Category image is required'),

    validatorMiddleware
];

export const updateCategoryValidator = [
    check('id')
        .isMongoId()
        .withMessage('Invalid category ID format'),

    body('name')
        .optional()
        .custom((val, { req }) => {
            req.body.slug = slugify(val);
            return true;
        }),

    validatorMiddleware
];

export const deleteCategoryValidator = [
    check('id')
        .isMongoId()
        .withMessage('Invalid category ID format'),

    validatorMiddleware
];