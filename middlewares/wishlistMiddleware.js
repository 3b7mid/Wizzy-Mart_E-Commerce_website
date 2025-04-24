import { check } from 'express-validator';
import validatorMiddleware from './validatorMiddleware.js';
import Product from '../models/productModel.js';
import User from '../models/userModel.js';

export const addProductToWishlistValidator = [
    check('productId')
        .notEmpty()
        .withMessage('Product ID is required')
        .isMongoId()
        .withMessage('Invalid product ID format')
        .custom(async (productId) => {
            const product = await Product.findById(productId);
            if (!product) {
                return Promise.reject(
                    new Error(`No product found with this ID: ${productId}`)
                );
            }
        }),

    validatorMiddleware
];

export const removeProductFromWishlistValidator = [
    check('productId')
        .isMongoId()
        .withMessage('Invalid product ID format')
        .custom(async (productId, { req } ) => {
            const product = await Product.findById(productId);
            if (!product) {
                return Promise.reject(
                    new Error(`No product found with this ID: ${productId}`)
                );
            }

            const user = await User.findById(req.user._id);
            if (!user || !user.wishlist.includes(productId)) {
                return Promise.reject(
                    new Error(`Product with ID: ${productId} is not in your wishlist`)
                )
            }
        }),

    validatorMiddleware
];