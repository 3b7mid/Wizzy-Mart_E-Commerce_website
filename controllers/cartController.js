import asyncHandler from 'express-async-handler';
import { sanitizeCart } from '../utils/sanitizeData.js';
import { addProductToCartService, getUserCartService, removeSpecificCartItemService, clearCartService, applyCouponService, updateCartItemService } from '../services/cartService.js';

// @desc    Add product to cart
// @route   POST /api/cart
// @access  Private/User
export const addProductToCart = asyncHandler(async (req, res) => {
    const cart = await addProductToCartService(req.user._id, req.body);

    res.status(200).json({
        success: true,
        message: 'Product added to cart successfully',
        numOfCartItems: cart.cartItems.length,
        data: sanitizeCart(cart)
    });
});

// @desc    Get logged user cart
// @route   GET /api/cart
// @access  Private/User
export const getUserCart = asyncHandler(async (req, res) => {
    const cart = await getUserCartService(req.user._id);

    res.status(200).json({
        success: true,
        numOfCartItems: cart.cartItems.length,
        data: sanitizeCart(cart)
    });
});

// @desc    Update cart item
// @route   PUT /api/cart/:itemId
// @access  Private/User
export const updateCartItem = asyncHandler(async (req, res) => {
    const { itemId } = req.params;

    const cart = await updateCartItemService(req.user._id, itemId, req.body);

    res.status(200).json({
        success: true,
        message: 'Cart item updated successfully',
        numOfCartItems: cart.cartItems.length,
        data: sanitizeCart(cart)
    });
});

// @desc    Remove specific cart item
// @route   DELETE /api/cart/:itemId
// @access  Private/User
export const removeSpecificCartItem = asyncHandler(async (req, res) => {
    const { itemId } = req.params;
    const cart = await removeSpecificCartItemService(req.user._id, itemId);

    res.status(200).json({
        success: true,
        message: 'Cart item removed successfully',
        numOfCartItems: cart.cartItems.length,
        data: sanitizeCart(cart)
    });
});

// @desc    Clear logged user cart
// @route   DELETE /api/cart
// @access  Private/User
export const clearCart = asyncHandler(async (req, res) => {
    await clearCartService(req.user._id);

    res.status(200).json({
        success: true,
        message: 'Cart has been cleared successfully.'
    });
});

// @desc    Apply coupon on logged user cart
// @route   PUT /api/cart/apply-coupon
// @access  Private/User
export const applyCoupon = asyncHandler(async (req, res) => {
    const { coupon } = req.body;
    
    const cart = await applyCouponService(req.user._id, coupon);

    res.status(200).json({
        success: true,
        message: 'Coupon applied successfully. Discount has been added to your cart total.',
        numOfCartItems: cart.cartItems.length,
        data: sanitizeCart(cart)
    });
}); 