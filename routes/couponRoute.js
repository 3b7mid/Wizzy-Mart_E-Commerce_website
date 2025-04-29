import express from 'express';
import { protect, allowedTo } from '../services/authService.js';
import { getCouponValidator, createCouponValidator, updateCouponValidator, deleteCouponValidator } from '../validators/couponValidator.js';
import { getCoupons, createCoupon, getCoupon, updateCoupon, deleteCoupon } from '../services/couponService.js';

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