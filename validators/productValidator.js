import { param, body } from 'express-validator';
import validatorMiddleware from '../middlewares/validatorMiddleware.js';
import ApiError from '../utils/apiError.js';
import slugify from 'slugify';
import Category from '../models/categoryModel.js';
import SubCategory from '../models/subCategoryModel.js';
import Brand from '../models/brandModel.js';

export const createProductValidator = [
    body('name')
        .notEmpty()
        .withMessage('Product title is required.')
        .isLength({ min: 5, max: 100 })
        .withMessage('Product title must be between 5 and 100 characters.')
        .custom((val, { req }) => {
            req.body.slug = slugify(val);
            return true;
        }),

    body('description')
        .optional()
        .isLength({ max: 2000 })
        .withMessage('Too long description.'),

    body('quantity')
        .notEmpty()
        .withMessage('Product quantity is required.')
        .isNumeric()
        .withMessage('Product quantity must be a number.'),

    body('sold')
        .optional()
        .isNumeric()
        .withMessage('Product sold quantity must be a number.'),

    body('price')
        .notEmpty()
        .withMessage('Product price is required.')
        .isNumeric()
        .withMessage('Product price must be a number.')
        .isLength({ max: 32 })
        .withMessage('Too long price.'),

    body('priceAfterDiscount')
        .optional()
        .isNumeric()
        .withMessage('Product priceAfterDiscount must be a number.')
        .toFloat()
        .custom((val, { req }) => {
            if (val < 0 || val >= req.body.price) {
                throw new ApiError('priceAfterDiscount must be lower than price.', 400);
            }
            return true;
        }),

    body('imageCover')
        .notEmpty()
        .withMessage('product imageCover is required.'),

    body('images')
        .optional()
        .isArray()
        .withMessage('Images should be array of string.'),

    body('category')
        .isMongoId()
        .withMessage('Invalid ID format.')
        .notEmpty()
        .withMessage('Product must belong to a category.')
        .custom(async (val) => {
            const category = await Category.findById(val);
            if (!category) {
                throw new ApiError(`category not found.`, 404);
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

    body('brand')
        .optional()
        .isMongoId()
        .withMessage('Invalid ID format.')
        .custom(async (val) => {
            const brand = await Brand.findById(val);
            if (!brand) {
                throw new ApiError(`Brand not found.`, 404);
            }
            return true;
        }),

    body('sku')
        .optional()
        .isString()
        .withMessage('SKU must be a string.'),

    body('model')
        .optional()
        .isString()
        .withMessage('Model must be a string.'),

    body('features')
        .optional()
        .isArray()
        .withMessage('Features must be an array of strings.'),

    body('tags')
        .optional()
        .isArray()
        .withMessage('Tags must be an array of strings.'),

    body('colors')
        .optional()
        .isArray()
        .withMessage('Colors must be an array of strings.'),

    body('size')
        .optional()
        .isString()
        .withMessage('Size must be a string.'),

    body('memory')
        .optional()
        .isString()
        .withMessage('Memory must be a string.'),

    body('weight')
        .optional()
        .isString()
        .withMessage('Weight must be a string.'),

    body('storage')
        .optional()
        .isString()
        .withMessage('Storage must be a string.'),

    body('shippingInfo')
        .optional()
        .isArray()
        .withMessage('Shipping information must be an array of strings.'),

    validatorMiddleware
];

export const updateProductValidator = [
    param('productId')
        .isMongoId()
        .withMessage('Invalid product id format.'),

    body('name')
        .optional()
        .custom((val, { req }) => {
            if (val) {
                req.body.slug = slugify(val);
            }
            return true;
        }),

    body('description')
        .optional()
        .isLength({ max: 2000 })
        .withMessage('Too long description.'),

    body('quantity')
        .optional()
        .notEmpty()
        .withMessage('Product quantity is required.')
        .isNumeric()
        .withMessage('Product quantity must be a number.'),

    body('sold')
        .optional()
        .isNumeric()
        .withMessage('Product sold quantity must be a number.'),

    body('price')
        .optional()
        .notEmpty()
        .withMessage('Product price is required.')
        .isNumeric()
        .withMessage('Product price must be a number.')
        .isLength({ max: 32 })
        .withMessage('Too long price.'),

    body('priceAfterDiscount')
        .optional()
        .isNumeric()
        .withMessage('Product priceAfterDiscount must be a number.')
        .toFloat()
        .custom((value, { req }) => {
            if (value < 0 || value >= req.body.price) {
                throw new ApiError('priceAfterDiscount must be lower than price.', 400);
            }
            return true;
        }),

    body('imageCover')
        .optional()
        .notEmpty()
        .withMessage('product imageCover is required.'),

    body('images')
        .optional()
        .isArray()
        .withMessage('Images should be array of string.'),

    body('category')
        .optional()
        .isMongoId()
        .withMessage('Invalid ID format.')
        .notEmpty()
        .withMessage('Product must belong to a category.')
        .custom(async (val) => {
            const category = await Category.findById(val);
            if (!category) {
                throw new ApiError(`category not found.`, 404);
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

    body('brand')
        .optional()
        .isMongoId()
        .withMessage('Invalid ID format.')
        .custom(async (val) => {
            const brand = await Brand.findById(val);
            if (!brand) {
                throw new ApiError('Brand not found.', 404);
            }
            return true;
        }),

    body('sku')
        .optional()
        .isString()
        .withMessage('SKU must be a string.'),

    body('model')
        .optional()
        .isString()
        .withMessage('Model must be a string.'),

    body('features')
        .optional()
        .isArray()
        .withMessage('Features must be an array of strings.'),

    body('tags')
        .optional()
        .isArray()
        .withMessage('Tags must be an array of strings.'),

    body('colors')
        .optional()
        .isArray()
        .withMessage('Colors must be an array of strings.'),

    body('size')
        .optional()
        .isString()
        .withMessage('Size must be a string.'),

    body('memory')
        .optional()
        .isString()
        .withMessage('Memory must be a string.'),

    body('weight')
        .optional()
        .isString()
        .withMessage('Weight must be a string.'),

    body('storage')
        .optional()
        .isString()
        .withMessage('Storage must be a string.'),

    body('shippingInfo')
        .optional()
        .isArray()
        .withMessage('Shipping information must be an array of strings.'),

    validatorMiddleware,
];

export const ProductIDValidator = [
    param('productId')
        .isMongoId()
        .withMessage('Invalid Product id format.'),

    validatorMiddleware
];