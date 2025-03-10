import asyncHandler from 'express-async-handler';
import ApiError from '../utils/apiError.js';
import ApiFeatures from '../utils/apiFeatures.js';
import { sanitizeOrder } from '../utils/sanitizeData.js';
import Stripe from 'stripe';
import Product from '../models/productModel.js';
import Cart from '../models/cartModel.js';
import Order from '../models/orderModel.js';

const calculateTotalOrderPrice = (cart) => {
    return cart.totalPriceAfterDiscount || cart.totalOrderPrice;
};

// @desc Create direct order
// @route POST /api/orders/direct-order
// @access Protected/User
export const createDirectOrder = asyncHandler(async (req, res, next) => {
    const { cartItems, shippingAddress } = req.body;
    if (!cartItems || cartItems.length === 0) {
        return next(new ApiError('No products provided', 400));
    }

    const productIds = cartItems.map((item) => item.product);
    const products = await Product.find({ _id: { $in: productIds } });

    if (products.length !== cartItems.length) {
        return next(new ApiError('Some products do not exist', 400));
    }

    let totalOrderPrice = 0;
    let updatedCartItems = [];

    for (const item of cartItems) {
        const product = products.find((p) => String(p._id) === String(item.product));
        if (!product) {
            return next(new ApiError(`Product not found: ${item.product}`, 404));
        }
        if (product.quantity < item.amount) {
            return next(
                new ApiError(
                    `Insufficient stock for "${product.title}". Available: ${product.quantity}, Requested: ${item.amount}`,
                    400
                )
            );
        }

        totalOrderPrice += product.price * item.amount;

        updatedCartItems.push({
            product: item.product,
            amount: item.amount,
            color: item.color,
            price: product.price
        });
    }

    let shippingPrice = 0;

    const newOrder = await Order.create({
        user: req.user._id,
        cartItems: updatedCartItems,
        shippingAddress,
        totalOrderPrice,
        shippingPrice,
        paymentMethodType: 'cash',
        isPaid: false
    });

    const bulkOption = cartItems.map((item) => ({
        updateOne: {
            filter: { _id: item.product },
            update: { $inc: { quantity: -item.amount, sold: +item.amount } }
        }
    }));

    if (bulkOption.length > 0) {
        await Product.bulkWrite(bulkOption, {});
    }

    await newOrder.populate({
        path: 'user',
        select: '_id name email'
    });

    res.status(201).json({
        status: 'success',
        data: sanitizeOrder(newOrder)
    });
});

// @desc    Create cash order
// @route   POST /api/orders/cartId
// @access  Protected/User
export const createCashOrder = asyncHandler(async (req, res, next) => {
    const { cartId } = req.params;
    const shippingPrice = 0;
    const cart = await Cart.findById(cartId);
    if (!cart) {
        return next(new ApiError(`There is no such cart with ID: ${cartId}`, 404));
    }

    const totalOrderPrice = calculateTotalOrderPrice(cart) + shippingPrice;

    const order = await Order.create({
        user: req.user._id,
        cartItems: cart.cartItems,
        shippingAddress: req.body.shippingAddress,
        shippingPrice,
        totalOrderPrice,
        paymentMethodType: 'cash',
        isPaid: false
    });

    if (order) {
        const bulkOption = cartItems.map((item) => ({
            updateOne: {
                filter: { _id: item.product },
                update: { $inc: { quantity: -item.amount, sold: +item.amount } }
            }
        }));

        await Product.bulkWrite(bulkOption, {});

        await Cart.findByIdAndDelete(cartId);
    }

    await order.populate({
        path: 'user',
        select: '_id name email'
    });

    res.status(201).json({
        status: 'success',
        data: sanitizeOrder(order)
    });
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Protect/Admin
export const getAllOrders = asyncHandler(async (req, res, next) => {
    const totalOrders = await Order.countDocuments();
    const features = new ApiFeatures(Order.find(), req.query)
        .filter()
        .sort()
        .limitFields()
        .search()
        .paginate(totalOrders)

    const orders = await features.mongooseQuery.exec();

    res.status(200).json({
        results: orders.length,
        pagination: features.paginationResult,
        data: orders.map(sanitizeOrder)
    });
});

// @desc    Get all user orders
// @route   GET /api/orders/my-orders
// @access  Protect/User/Admin
export const getAllUserOrders = asyncHandler(async (req, res, next) => {
    const totalOrders = await Order.countDocuments();
    const features = new ApiFeatures(Order.find({ user: req.user._id }).populate('user', 'name email -_id'), req.query).paginate(totalOrders);

    const orders = await features.mongooseQuery.exec();

    res.status(200).json({
        results: orders.length,
        pagination: features.paginationResult,
        data: orders.map(sanitizeOrder)
    });
});

// @desc    Delete order
// @route   DELETE api/orders/id
// @access  Protect Admin/User
export const deleteOrder = asyncHandler(async (req, res, next) => {
    const { orderId } = req.params;
    const order = await Order.findById(orderId);
    if (!order) {
        return next(new ApiError(`There is no such order with this ID: ${orderId}`, 404));
    }

    if (req.user.role !== 'admin' && String(order.user) !== req.user.id) {
        return next(new ApiError('Unauthorized to delete this order', 403));
    }

    if (req.user.role === 'admin') {
        await Order.findByIdAndDelete(orderId);
        return res.status(200).end();
    }

    const orderTime = new Date(order.createdAt);
    const currentTime = new Date();
    const timeDifference = (currentTime - orderTime) / (1000 * 60 * 60);
    if (timeDifference > 1) {
        return next(new ApiError('You can only delete orderss within 1 hour', 400));
    }

    await Order.findByIdAndDelete(orderId);

    return res.status(200).end();
});

// @desc    Get checkout session from stipe and send it as response
// @route   DELETE api/orders/checkout-session/cartId
// @access  Protect/User
export const checkoutSession = asyncHandler(async (req, res, next) => {
    const shippingPrice = 0;
    const { cartId } = req.params;

    const cart = await Cart.findById(cartId).populate("cartItems.product")
    if (!cart) {
        return next(new ApiError(`There is no such cart with ID: ${cartId}`, 404));
    }

    const line_items = cart.cartItems.map(item => ({
        price_data: {
            currency: 'egp',
            unit_amount: Math.round(Number(item.price) * 100) + shippingPrice,
            product_data: {
                name: item.product.title
            },
        },
        quantity: Number(item.amount) || 1,
    }));
    
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items,
        mode: 'payment',
        success_url: `${req.protocol}://${req.get('host')}/orders`,
        cancel_url: `${req.protocol}://${req.get('host')}/cart`,
        client_reference_id: cartId,
        customer_email: req.user.email,
        metadata: req.body.shippingAddress
    });

    res.status(200).json({
        status: 'success',
        session
    });
});