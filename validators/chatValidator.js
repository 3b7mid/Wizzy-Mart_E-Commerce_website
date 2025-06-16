import { body } from 'express-validator';
import validatorMiddleware from '../middlewares/validatorMiddleware.js';

export const chatMessageValidator = [
    body('message')
        .notEmpty()
        .withMessage('Message is required')
        .isString()
        .withMessage('Message must be a string')
        .isLength({ min: 1, max: 500 })
        .withMessage('Message must be between 1 and 500 characters'),

    validatorMiddleware
]; 