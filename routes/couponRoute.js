import express from 'express';
import { getCoupons, createCoupon, getCoupon, updateCoupon, deleteCoupon } from '../services/couponService.js';
import { getCouponValidator, createCouponValidator, updateCouponValidator, deleteCouponValidator } from '../middlewares/couponMiddleware.js';
import { protect, allowedTo } from '../services/authService.js';

const router = express.Router();

router.use(protect);

router.route('/')
    .get(allowedTo('admin', 'user'), getCoupons)
    .post(allowedTo('admin'), createCouponValidator, createCoupon);

router.route('/:couponId')
    .get(allowedTo('admin', 'user'), getCouponValidator, getCoupon)
    .put(allowedTo('admin'), updateCouponValidator, updateCoupon)
    .delete(allowedTo('admin'), deleteCouponValidator, deleteCoupon);

export default router;