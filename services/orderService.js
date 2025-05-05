import asyncHandler from 'express-async-handler';
import ApiError from '../utils/apiError.js';
import ApiFeatures from '../utils/apiFeatures.js';
import { sanitizeOrder, sanitizeshippingPrice } from '../utils/sanitizeData.js';
import Stripe from 'stripe';
import Product from '../models/productModel.js';
import Cart from '../models/cartModel.js';
import User from '../models/userModel.js';
import globalShippingPrice from '../models/shippingPriceModel.js';
import Order from '../models/orderModel.js';

const calculateTotalOrderPrice = (cart) => {
    const discountPrice = cart.totalPriceAfterDiscount;
    const cartPrice = cart.totalCartPrice;

    if (typeof discountPrice === 'number' && !isNaN(discountPrice)) {
        return discountPrice;
    } else if (typeof cartPrice === 'number' && !isNaN(cartPrice)) {
        return cartPrice;
    }
    return 0;
};

// @desc Create direct order
// @route POST /api/orders/direct-order
// @access Protected/User
// export const createDirectOrder = asyncHandler(async (req, res, next) => {
//     const { cartItems, shippingAddress } = req.body;
//     if (!cartItems || cartItems.length === 0) {
//         return next(new ApiError('No products provided', 400));
//     }

//     const productIds = cartItems.map((item) => item.product);
//     const products = await Product.find({ _id: { $in: productIds } });

//     if (products.length !== cartItems.length) {
//         return next(new ApiError('Some products do not exist', 400));
//     }

//     let totalOrderPrice = 0;
//     let updatedCartItems = [];

//     for (const item of cartItems) {
//         const product = products.find((p) => String(p._id) === String(item.product));
//         if (!product) {
//             return next(new ApiError(`Product not found: ${item.product}`, 404));
//         }
//         if (product.quantity < item.amount) {
//             return next(
//                 new ApiError(
//                     `Insufficient stock for "${product.title}". Available: ${product.quantity}, Requested: ${item.amount}`,
//                     400
//                 )
//             );
//         }

//         totalOrderPrice += product.price * item.amount;

//         updatedCartItems.push({
//             product: item.product,
//             amount: item.amount,
//             color: item.color,
//             price: product.price
//         });
//     }

//     let shippingPrice = 0;
//     try {
//         const shipPrice = await globalShippingPrice.findOne();
//         if (shipPrice && shipPrice.shippingPrice) {
//             shippingPrice = shipPrice.shippingPrice;
//         }
//     } catch (error) {
//         return next(new ApiError('Error fetching shipping price', 500));
//     }

//     totalOrderPrice += shippingPrice;

//     const newOrder = await Order.create({
//         user: req.user._id,
//         cartItems: updatedCartItems,
//         shippingAddress,
//         totalOrderPrice,
//         shippingPrice,
//         paymentMethodType: 'cash',
//         isPaid: false
//     });

//     const bulkOption = cartItems.map((item) => ({
//         updateOne: {
//             filter: { _id: item.product },
//             update: { $inc: { quantity: -item.amount, sold: +item.amount } }
//         }
//     }));

//     if (bulkOption.length > 0) {
//         await Product.bulkWrite(bulkOption, {});
//     }

//     await newOrder.populate({
//         path: 'user',
//         select: '_id name email'
//     });

//     res.status(201).json({
//         status: 'success',
//         data: sanitizeOrder(newOrder)
//     });
// });

// @desc    Create cash order
// @route   POST /api/orders/cartId
// @access  Protected/User
export const createCashOrder = asyncHandler(async (req, res, next) => {
    const { cartId } = req.params;
    const shipPrice = await globalShippingPrice.findOne();
    const shippingPrice = shipPrice ? shipPrice.shippingPrice : 0;
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
        const bulkOption = cart.cartItems.map((item) => ({
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
    const features = new ApiFeatures(Order.find().populate('user', '_id name email'), req.query)
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

// @desc    Update order paid status to paid
// @route   PUT /api/orders/:id/pay
// @access  Protected/Admin
export const updateOrderToPaid = asyncHandler(async (req, res, next) => {
    const { orderId } = req.params;
    const order = await Order.findById(orderId);
    if (!order) {
        return next(new ApiError(`There is no such a order with this ID: ${orderId}`, 404));
    }

    order.isPaid = true;
    order.paidAt = Date.now();

    const updateOrder = await order.save();

    res.status(200).json({
        status: 'success',
        data: sanitizeOrder(updateOrder)
    });
});

// @desc    Update order delivered status
// @route   PUT /api/orders/:id/deliver
// @access  Protected/Admin
export const updateOrderToDelivered = asyncHandler(async (req, res, next) => {
    const { orderId } = req.params;
    const order = await Order.findById(orderId);
    if (!order) {
        return next(new ApiError(`There is no such a order with this ID: ${orderId}`, 404));
    }

    order.isDelivered = true;
    order.deliveredAt = Date.now();

    const updateOrder = await order.save();

    res.status(200).json({
        status: 'success',
        data: sanitizeOrder(updateOrder)
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
    const { cartId } = req.params;
    const cart = await Cart.findById(cartId).populate("cartItems.product");

    if (!cart) return next(new ApiError(`No cart found with ID: ${cartId}`, 404));

    const shipping = await globalShippingPrice.findOne();
    const shippingPrice = shipping?.shippingPrice || 0;

    const cartPrice = cart.totalPriceAfterDiscount ?? cart.totalCartPrice ?? 0;
    const totalOrderPrice = cartPrice + shippingPrice;

    if (isNaN(totalOrderPrice)) {
        return next(new ApiError('Invalid total order price', 400));
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{
            price_data: {
                currency: 'egp',
                product_data: {
                    name: `Order from ${req.user.name}`,
                },
                unit_amount: Math.round(totalOrderPrice * 100),
            },
            quantity: 1,
        }],
        mode: 'payment',
        success_url: `${req.protocol}://${req.get('host')}/orders`,
        cancel_url: `${req.protocol}://${req.get('host')}/cart`,
        customer_email: req.user.email,
        client_reference_id: cartId,
        metadata: {
            address: req.body.shippingAddress?.address || '',
            phone: req.body.shippingAddress?.phone || '',
            city: req.body.shippingAddress?.city || '',
        },
    });

    res.status(200).json({ status: 'success', session });
});

const createCardOrder = async (session) => {
    const cartId = session.client_reference_id;
    const shippingAddress = session.metadata;
    const orderPrice = session.amount_total / 100;

    const cart = await Cart.findById(cartId);
    if (!cart) return;
    const user = await User.findOne({ email: session.customer_email });
    if (!user) return;

    const order = await Order.create({
        user: user._id,
        cartItems: cart.cartItems,
        shippingAddress,
        totalOrderPrice: orderPrice,
        isPaid: true,
        paidAt: Date.now(),
        paymentMethodType: 'card',
    });

    if (order) {
        const bulkOption = cart.cartItems.map((item) => ({
            updateOne: {
                filter: { _id: item.product },
                update: { $inc: { quantity: -item.amount, sold: +item.amount } },
            },
        }));
        await Product.bulkWrite(bulkOption, {});

        await Cart.findByIdAndDelete(cartId);
    }
};

// @desc    This webhook will run when stripe payment success paid
// @route   POST /webhook-checkout
// @access  Protected/User
export const webhookCheckout = asyncHandler(async (req, res, next) => {
    const sig = req.headers['stripe-signature'];

    let event;

    try {
        event = Stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_KEY
        );
    } catch (err) {
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
        await createCardOrder(event.data.object);
    }

    res.status(200).json({ received: true });
});

// @desc    Update Global shipping Price
// @route   PUT /api/global-shipping
// @access  Protected/Admin
export const updateGlobalShippingPrice = asyncHandler(async (req, res, next) => {
    const { shippingPrice } = req.body;

    let price = await globalShippingPrice.findOne();
    if (!price) {
        price = new globalShippingPrice({ shippingPrice });
    }
    else {
        price.shippingPrice = shippingPrice;
    }

    await price.save();

    res.status(200).json({
        status: 'success',
        data: sanitizeshippingPrice(price)
    });
});

// @desc    Update Global shipping Price
// @route   PUT /api/:id/shipping
// @access  Protected/Admin
export const updateShippingPrice = asyncHandler(async (req, res, next) => {
    const { shippingPrice } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) {
        return next(new ApiError('Order not found', 404));
    }

    const updatedTotalOrderPrice = order.totalOrderPrice + (shippingPrice - order.shippingPrice);

    order.shippingPrice = shippingPrice;
    order.totalOrderPrice = updatedTotalOrderPrice;
    await order.save();

    res.status(200).json({
        status: 'success',
        data: sanitizeOrder(order)
    });
});