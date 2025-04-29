import express from 'express';
import { protect, allowedTo } from '../services/authService.js';
import { addProductToCartValidator, applyCouponValidator, getCartValidator, removeCartItemValidator } from '../validators/cartValidator.js';
import { addProductToCart, getLoggedUserCart, removeSpecificCartItem, clearCart, applyCoupon } from '../services/cartService.js';

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