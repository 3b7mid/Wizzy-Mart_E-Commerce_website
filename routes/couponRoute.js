import express from 'express';
import { protect, allowedTo } from '../services/authService.js';
import { getCouponValidator, createCouponValidator, updateCouponValidator, deleteCouponValidator } from '../validators/couponValidator.js';
import { getCoupons, createCoupon, getCoupon, updateCoupon, deleteCoupon } from '../services/couponService.js';

const router = express.Router();

router.use(protect, allowedTo('admin'));

router.route('/')
    .get(getCoupons)
    .post(createCouponValidator, createCoupon);

router.route('/:couponId')
    .get(getCouponValidator, getCoupon)
    .put(updateCouponValidator, updateCoupon)
    .delete(deleteCouponValidator, deleteCoupon);

export default router;