import { body, param } from 'express-validator';
import validatorMiddleware from '../middlewares/validatorMiddleware.js';

export const addProductToWishlistValidator = [
    body('productId')
        .notEmpty()
        .withMessage('Product ID is required.')
        .isMongoId()
        .withMessage('Invalid product ID format.'),

    validatorMiddleware
];

export const removeProductFromWishlistValidator = [
    param('productId')
        .isMongoId()
        .withMessage('Invalid product ID format'),

    validatorMiddleware
];