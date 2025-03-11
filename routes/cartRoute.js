import express from 'express';
import { addProductToCart, getLoggedUserCart, removeSpecificCartItem, clearCart, applyCoupon } from '../services/cartService.js';
import { addProductToCartValidator, applyCouponValidator, getCartValidator, removeCartItemValidator } from '../middlewares/cartMiddleware.js';
import { protect, allowedTo } from '../services/authService.js';

const router = express.Router();

router.use(protect, allowedTo('user'));

router
    .route('/')
    .get(getCartValidator, getLoggedUserCart)
    .post(addProductToCartValidator, addProductToCart)
    .delete(clearCart);

router.route('/apply-coupon')
    .put(applyCouponValidator, applyCoupon);

router
    .route('/:itemId')
    .delete(removeCartItemValidator, removeSpecificCartItem);

export default router;