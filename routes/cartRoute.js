import express from 'express';
import { protect, allowedTo } from '../middlewares/authMiddleware.js';
import { addProductToCartValidator, applyCouponValidator, removeCartItemValidator, updateCartItemValidator } from '../validators/cartValidator.js';
import { addProductToCart, getUserCart, removeSpecificCartItem, clearCart, applyCoupon, updateCartItem } from '../controllers/cartController.js';

const router = express.Router();

router.use(protect, allowedTo('user'));

router
    .route('/')
    .get(getUserCart)
    .post(addProductToCartValidator, addProductToCart)
    .delete(clearCart);

router
    .route('/apply-coupon')
    .put(applyCouponValidator, applyCoupon);

router
    .route('/:itemId')
    .put(updateCartItemValidator, updateCartItem)
    .delete(removeCartItemValidator, removeSpecificCartItem);

export default router;