import asyncHandler from 'express-async-handler';
import { sanitizeCoupon } from '../utils/sanitizeData.js';
import { createCouponService, getCouponsService, getCouponService, updateCouponService, deleteCouponService } from '../services/couponService.js';

// @desc    Create a coupon
// @route   POST /api/v1/coupons
// @access  Private/Admin
export const createCoupon = asyncHandler(async (req, res) => {
    const coupon = await createCouponService(req.user._id, req.body);

    res.status(201).json({
        success: true,
        message: 'Coupon created successfully.',
        data: sanitizeCoupon(coupon),
    });
});

// @desc    Get all coupons
// @route   GET /api/v1/coupons
// @access  Private/Admin
export const getCoupons = asyncHandler(async (req, res) => {
    const { totalCoupons, pagination, coupons } = await getCouponsService();

    res.status(200).json({
        success: true,
        results: totalCoupons,
        pagination,
        data: coupons.map(sanitizeCoupon)
    });
});

// @desc    Get a coupon
// @route   GET /api/v1/coupons/:couponId
// @access  Private/Admin
export const getCoupon = asyncHandler(async (req, res) => {
    const { couponId } = req.params;

    const coupon = await getCouponService(couponId);

    res.status(200).json({
        success: true,
        data: sanitizeCoupon(coupon)
    });
});

// @desc    Update a coupon
// @route   PUT /api/v1/coupons/:couponId
// @access  Private/Admin
export const updateCoupon = asyncHandler(async (req, res) => {
    const { couponId } = req.params;
    
    const coupon = await updateCouponService(couponId, req.body);

    res.status(200).json({
        success: true,
        message: 'Coupon updated successfully.',
        data: sanitizeCoupon(coupon)
    });
});

// @desc    Delete a coupon
// @route   PUT /api/v1/coupon/:couponId
// @access  Private/Admin
export const deleteCoupon = asyncHandler(async (req, res) => {
    const { couponId } = req.params;

    await deleteCouponService(couponId);

    res.status(200).json({
        success: true,
        message: 'Coupon deleted successfully.'
    });
});