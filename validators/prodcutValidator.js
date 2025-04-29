import { check, body } from 'express-validator';
import validatorMiddleware from '../middleware/validatorMiddleware.js';
import slugify from 'slugify';
import Category from '../models/categoryModel.js';
import SubCategory from '../models/subCategoryModel.js';
import Brand from '../models/brandModel.js';

export const createProductValidator = [
    check('title')
        .isLength({ min: 3 })
        .withMessage('Product title must be at least 3 characters')
        .notEmpty()
        .withMessage('Product title is required')
        .custom((val, { req }) => {
            req.body.slug = slugify(val);
            return true;
        }),

    check('description')
        .isLength({ max: 2000 })
        .withMessage('Too long description'),

    check('quantity')
        .notEmpty()
        .withMessage('Product quantity is required')
        .isNumeric()
        .withMessage('Product quantity must be a number'),

    check('sold')
        .optional()
        .isNumeric()
        .withMessage('Product sold quantity must be a number'),

    check('price')
        .notEmpty()
        .withMessage('Product price is required')
        .isNumeric()
        .withMessage('Product price must be a number')
        .isLength({ max: 32 })
        .withMessage('Too long price.'),

    check('priceAfterDiscount')
        .optional()
        .isNumeric()
        .withMessage('Product priceAfterDiscount must be a number.')
        .toFloat()
        .custom((value, { req }) => {
            if (value < 0 || value >= req.body.price) {
                throw new Error('priceAfterDiscount must be lower than price.');
            }
            return true;
        }),

    check('colors')
        .optional()
        .isArray()
        .withMessage('Colors should be array of string.'),

    check('imageCover')
        .notEmpty()
        .withMessage('product imageCover is required.'),

    check('images')
        .optional()
        .isArray()
        .withMessage('Images should be array of string.'),

    check('category')
        .notEmpty()
        .withMessage('Product must belong to a category.')
        .isMongoId()
        .withMessage('Invalid ID format.')
        .custom(async (categoryId) => {
            const category = await Category.findById(categoryId);
            if (!category) {
                return Promise.reject(
                    new Error(`No category with this id: ${categoryId}`)
                );
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
                    return Promise.reject(new AbiError(`SubCategory not found: ${subCategoryId}`, 404));
                }
            }
        }),

    check('brand')
        .optional()
        .isMongoId()
        .withMessage('Invalid ID format.')
        .custom(async (brandId, { req }) => {
            const brand = await Brand.findById(brandId);
            if (!brand) {
                return Promise.reject(new Error(`No subCategory with this id: ${brand}`));
            }
        }),

    validatorMiddleware
];

export const getProductValidator = [
    check('id')
        .isMongoId()
        .withMessage('Invalid Product id format'),

    validatorMiddleware
]

export const updateProductValidator = [
    check('id')
        .isMongoId()
        .withMessage('Invalid product id format'),

    body('title')
        .optional()
        .custom((val, { req }) => {
            if (val) {
                req.body.slug = slugify(val, { lower: true });
            }
            return true;
        }),

    validatorMiddleware,
];

export const deleteProductValidator = [
    check('id')
        .isMongoId()
        .withMessage('Invalid product id format'),

    validatorMiddleware,
];