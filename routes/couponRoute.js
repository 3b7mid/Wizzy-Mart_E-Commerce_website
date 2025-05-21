import express from 'express';
import { protect, allowedTo } from '../middlewares/authMiddleware.js';
import { createCouponValidator, CouponIDValidator, updateCouponValidator } from '../validators/couponValidator.js';
import { getCoupons, createCoupon, getCoupon, updateCoupon, deleteCoupon } from '../controllers/couponController.js';

const router = express.Router();

router.use(protect, allowedTo('admin'));

router.route('/')
    .get(getCoupons)
    .post(createCouponValidator, createCoupon);

router.route('/:couponId')
    .get(CouponIDValidator, getCoupon)
    .put(updateCouponValidator, updateCoupon)
    .delete(CouponIDValidator, deleteCoupon);

export default router;