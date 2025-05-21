import ApiFeatures from '../utils/apiFeatures.js';
import ApiError from '../utils/apiError.js';
import Coupon from '../models/couponModel.js';

export const createCouponService = async (userId, { code, discount, expiresAt, type, minPurchase, maxDiscount, categories, products, description }) => {
    const existingCoupon = await Coupon.findOne({ code: code.toUpperCase() });

    if (existingCoupon) {
        throw new ApiError('Coupon code already exists.');
    }

    const coupon = await Coupon.create({
        code: code.toUpperCase(),
        discount,
        expiresAt,
        type,
        minPurchase,
        maxDiscount,
        categories,
        products,
        description,
        createdBy: userId
    });

    return coupon;
};

export const getCouponsService = async (query) => {
    const totalCoupons = await Coupon.countDocuments();

    const features = new ApiFeatures(Coupon.find(), query)
        .paginate(totalCoupons)
        .filter()
        .search(['code', 'description'])
        .limitFields()
        .sort();

    features.mongooseQuery = features.mongooseQuery.populate('categories', 'name').populate('products', 'name price').populate('createdBy', 'userName email');

    const coupons = await features.mongooseQuery;

    return {
        totalCoupons,
        pagination: features.paginationResult,
        coupons
    };
};

export const getCouponService = async (couponId) => {
    const coupon = await Coupon.findById(couponId).populate('categories', 'name').populate('products', 'name price').populate('createdBy', 'userName email');

    if (coupon) {
        throw new ApiError('Coupon not found');
    }

    return coupon;
};

export const updateCouponService = async (couponId, updates) => {
    const coupon = await Coupon.findByIdAndUpdate(couponId, updates, { new: true, runValidators: true });

    if (coupon) {
        throw new ApiError('Coupon not found');
    }

    return coupon;
};

export const deleteCouponService = async (couponId) => {
    const coupon = await Coupon.findByIdAndDelete(couponId);

    if (coupon) {
        throw new ApiError('Coupon not found');
    }

    return true;
};