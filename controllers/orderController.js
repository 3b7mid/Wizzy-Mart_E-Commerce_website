import asyncHandler from 'express-async-handler';
import { sanitizeOrder } from '../utils/sanitizeData.js';
import { createCashOrderService, getOrdersService, getOrderService, updateOrderDetailsService, deleteOrderService, checkoutSession, webhookCheckout } from '../services/orderService.js';

// @desc    Create cash order
// @route   POST /api/orders/:cartId
// @access  Private/User
export const createCashOrder = asyncHandler(async (req, res) => {
    const { cartId } = req.params;
    const { billingInfo, orderNotes } = req.body;

    const order = await createCashOrderService({ userId: req.user._id, cartId, billingInfo, orderNotes });

    res.status(201).json({
        success: true,
        message: 'Order created successfully.',
        data: sanitizeOrder(order)
    });
});

// @desc    Get all orders
// @route   GET /api/orders -> for Admin
// @route   GET /api/orders/my-orders -> for user's orders (private)
// @route   GET /api/orders/seller-orders -> for seller's orders (private)
// @access  Private/ (Admin-Seller-User)
export const getOrders = asyncHandler(async (req, res) => {
    const isUserRoute = req.originalUrl.includes('/my-orders');
    const isSellerRoute = req.originalUrl.includes('/seller-orders');

    const { totalOrders, pagination, orders } = await getOrdersService(req.user, req.query, { isUserRoute, isSellerRoute });

    res.status(200).json({
        success: true,
        results: totalOrders,
        pagination,
        data: orders
    });
});

// @desc    Get an order
// @route   GET /api/orders/:orderId -> for Admin
// @route   GET /api/orders/my-orders/:orderId -> for user's orders (private)
// @route   GET /api/orders/seller-orders/:orderId -> for seller's orders (private)
// @access  Private/ (Admin-Seller-User)
export const getOrder = asyncHandler(async (req, res) => {
    const { orderId } = req.params;
    const isUserRoute = req.originalUrl.includes('/my-orders');
    const isSellerRoute = req.originalUrl.includes('/seller-orders');

    const order = await getOrderService(req.user, orderId, { isUserRoute, isSellerRoute });

    res.status(200).json({
        success: true,
        data: sanitizeOrder(order)
    });
});

// @desc    Update an order details
// @route   PUT /api/orders/orderId
// @access  Private/Admin
export const updateOrderDetails = asyncHandler(async (req, res) => {
    const { orderId } = req.params;

    const order = await updateOrderDetailsService(orderId, req.body);

    res.status(200).json({
        success: true,
        message: 'Order updated successfully.',
        data: sanitizeOrder(order)
    });
});

// @desc    Delete an order
// @route   PUT /api/orders/orderId
// @access  Private/Admin
export const deleteOrder = asyncHandler(async (req, res) => {
    const { orderId } = req.params;

    await deleteOrderService(req.user, orderId);

    res.status(200).json({
        success: true,
        message: 'Order deleted successfully'
    });
});

// @desc    Create checkout session
// @route   GET /api/orders/checkout-session/:cartId
// @access  Private/User
export const createCheckoutSession = asyncHandler(async (req, res, next) => {
    const result = await checkoutSession(req, res, next);
    if (result) {
        res.status(200).json(result);
    }
});

// @desc    Handle Stripe webhook
// @route   POST /api/orders/webhook-checkout
// @access  Public
export const handleWebhookCheckout = asyncHandler(async (req, res, next) => {
    const result = await webhookCheckout(req, res, next);
    if (result) {
        res.status(200).json(result);
    }
});
