import asyncHandler from 'express-async-handler';
import ApiError from '../utils/apiError.js';
import { sanitizeCart } from '../utils/sanitizeData.js';
import Product from '../models/productModel.js';
import Coupon from '../models/couponModel.js';
import Cart from '../models/cartModel.js';

const calcTotalCartPrice = (cart) => {
    let totalPrice = 0;
    cart.cartItems.forEach((item) => {
        totalPrice += item.amount * item.price;
    });
    cart.totalCartPrice = totalPrice;
    cart.totalPriceAfterDiscount ? cart.totalPriceAfterDiscount : cart.totalPrice
};

// @desc    Add product to  cart
// @route   POST /api/cart
// @access  Private/User
export const addProductToCart = asyncHandler(async (req, res, next) => {
    const { productId, color } = req.body;
    const product = await Product.findById(productId);
    if (!product) {
        return next(new ApiError('Prodcut not found', 404));
    }

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
        cart = await Cart.create({
            user: req.user._id,
            cartItems: [{ product: productId, color, price: product.price }]
        });
    } else {
        const productIndex = cart.cartItems.findIndex(
            (item) => item.product.toString() === productId && item.color === color
        );
        if (productIndex > -1) {
            const cartItem = cart.cartItems[productIndex];
            cartItem.amount += 1;

            cart.cartItems[productIndex] = cartItem;
        } else {
            cart.cartItems.push({ product: productId, color, price: product.price });
        }
    }

    calcTotalCartPrice(cart);
    await cart.save();

    res.status(200).json({
        status: 'success',
        message: 'Product added to cart successfully',
        numOfCartItems: cart.cartItems.length,
        data: sanitizeCart(cart)
    });
});

// @desc    Get logged user cart
// @route   GET /api/cart
// @access  Private/User
export const getLoggedUserCart = asyncHandler(async (req, res, next) => {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
        return next(new ApiError(`There is no cart for this user id: $req.user._id`, 404));
    }

    res.status(200).json({
        status: 'success',
        numOfCartItems: cart.cartItems.length,
        data: sanitizeCart(cart)
    });
});

// @desc    Remove specific cart item
// @route   DELETE /api/cart/:itemId
// @access  Private/User
export const removeSpecificCartItem = asyncHandler(async (req, res, next) => {
    const cart = await Cart.findOneAndUpdate(
        { user: req.user._id },
        {
            $pull: { cartItems: { _id: req.params.itemId } }
        },
        { new: true }
    );

    calcTotalCartPrice(cart);
    await cart.save();

    res.status(200).json({
        status: 'success',
        numOfCartItems: cart.cartItems.length,
        data: sanitizeCart(cart)
    });
});

// @desc    clear logged user cart
// @route   DELETE /api/cart
// @access  Private/User
export const clearCart = asyncHandler(async (req, res, next) => {
    await Cart.findOneAndDelete({ user: req.user._id });
    res.status(204).end();
    next();
});

// @desc    Apply coupon on logged user cart
// @route   PUT /api/v1/cart/applyCoupon
// @access  Private/User
export const applyCoupon = asyncHandler(async (req, res, next) => {
    const coupon = await Coupon.findOne({
        code: req.body.coupon,
        expiresAt: { $gt: Date.now() }
    });
    if (!coupon) {
        return next(new ApiError(`Coupon is invalid or expired`, 400));
    }

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
        return next(new ApiError('Cart not found', 404));
    }

    cart.totalPriceAfterDiscount = (cart.totalCartPrice * (1 - coupon.discount / 100)).toFixed(2);

    await cart.save();

    res.status(200).json({
        status: 'success',
        numOfCartItems: cart.cartItems.length,
        data: sanitizeCart(cart),
    });
});