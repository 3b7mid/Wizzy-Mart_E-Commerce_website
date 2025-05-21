import ApiError from '../utils/apiError.js';
import ApiFeatures from '../utils/apiFeatures.js';
import Stripe from 'stripe';
import Product from '../models/productModel.js';
import Cart from '../models/cartModel.js';
import User from '../models/userModel.js';
import Order from '../models/orderModel.js';

// Helper function to calculate total order price based on order items
const calculateTotalOrderPrice = (order) => {
    let total = 0;
    order.cartItems.forEach(item => { total += item.price * item.amount; });
    return order.totalOrderPriceAfterDiscount !== undefined && order.totalOrderPriceAfterDiscount !== null
        ? order.totalOrderPriceAfterDiscount
        : total;
};

export const createCashOrderService = async ({ userId, cartId, billingInfo, orderNotes }) => {
    const cart = await Cart.findById(cartId);
    if (!cart) {
        throw new ApiError('Cart not found', 404);
    }

    const shippingPrice = 0;

    const order = new Order({
        user: userId,
        orderID: Math.floor(100000 + Math.random() * 900000).toString(),
        cartItems: cart.cartItems.map(item => ({
            product: item.product,
            amount: item.amount,
            price: item.price,
            color: item.color
        })),
        billingInfo,
        orderNotes,
        shippingPrice: shippingPrice,
        totalOrderPriceAfterDiscount: cart.totalPriceAfterDiscount,
        paymentMethodType: 'cash',
        isPaid: false,
        status: 'pending'
    });

    const itemsTotalAfterDiscount = calculateTotalOrderPrice(order);

    order.totalOrderPrice = itemsTotalAfterDiscount + shippingPrice;

    await order.save();

    if (order) {
        const bulkOption = order.cartItems.map((item) => ({
            updateOne: {
                filter: { _id: item.product },
                update: { $inc: { quantity: -item.amount, sold: +item.amount } }
            }
        }));
        await Product.bulkWrite(bulkOption, {});

        await Cart.findByIdAndDelete(cartId);
    }

    const populatedOrder = await Order.findById(order._id)
        .populate({
            path: 'user',
            select: '_id userName email'
        })
        .populate({
            path: 'cartItems.product',
            select: 'name imageCover'
        });

    return populatedOrder;
};

export const getOrdersService = async (user, query, { isUserRoute = false, isSellerRoute = false }) => {
    let orders = [];
    let totalOrders = 0;

    if (!isUserRoute && !isSellerRoute && user.role === 'admin') {
        totalOrders = await Order.countDocuments();

        const features = new ApiFeatures(Order.find().populate('user', '_id userName email'), query)
            .filter()
            .sort()
            .limitFields()
            .search()
            .paginate(totalOrders);

        orders = await features.mongooseQuery.exec();

        return {
            totalOrders,
            pagination: features.paginationResult,
            orders
        };
    }

    if (isUserRoute || user.role === 'user') {
        totalOrders = await Order.countDocuments({ user: user._id });

        const features = new ApiFeatures(Order.find({ user: user._id }).populate('user', 'userName email -_id'), query)
            .paginate(totalOrders);

        orders = await features.mongooseQuery.exec();

        return {
            totalOrders,
            pagination: features.paginationResult,
            orders
        };
    }

    if (isSellerRoute || user.role === 'seller') {
        const allOrders = await Order.find()
            .populate('user', '_id userName email')
            .populate({
                path: 'cartItems.product',
                select: 'name imageCover seller',
                populate: {
                    path: 'seller',
                    select: '_id userName email'
                }
            });

        const sellerOrders = allOrders.filter(order =>
            order.cartItems.some(item =>
                item.product?.seller?._id?.toString() === user._id.toString()
            ));

        totalOrders = sellerOrders.length;

        const features = new ApiFeatures(Order.find({
            _id: { $in: sellerOrders.map(order => order._id) }
        }).populate('user', '_id userName email')
          .populate({
              path: 'cartItems.product',
              select: 'name imageCover seller',
              populate: {
                  path: 'seller',
                  select: '_id userName email'
              }
          }), query)
            .filter()
            .sort()
            .limitFields()
            .paginate(totalOrders);

        orders = await features.mongooseQuery.exec();

        return {
            totalOrders,
            pagination: features.paginationResult,
            orders
        };
    }

    throw new ApiError('Unauthorized access to orders', 403);
};

export const getOrderService = async (user, orderId, { isUserRoute = false, isSellerRoute = false }) => {
    const order = await Order.findById(orderId)
        .populate('user', '_id userName email')
        .populate({
            path: 'cartItems.product',
            select: 'name imageCover seller',
            populate: {
                path: 'seller',
                select: '_id userName email'
            }
        });

    if (!order) {
        throw new ApiError('Order not found', 404);
    }

    if (isUserRoute || user.role === 'user') {
        if (order.user._id.toString() !== user._id.toString()) {
            throw new ApiError('You are not authorized to view this order', 403);
        }
    }

    if (isSellerRoute || user.role === 'seller') {
        const isSellerAuthorized = order.cartItems.some(item =>
            item.product?.seller?._id?.toString() === user._id.toString()
        );

        if (!isSellerAuthorized) {
            throw new ApiError('You are not authorized to view this order', 403);
        }
    }

    if (!isUserRoute && !isSellerRoute && user.role !== 'admin') {
        throw new ApiError('Unauthorized access to orders', 403);
    }

    return order;
};

export const updateOrderDetailsService = async (orderId, updateData) => {
    const allowedUpdates = ['status', 'isPaid', 'paidAt', 'isDelivered', 'deliveredAt'];
    const updateKeys = Object.keys(updateData);
    const invalidFields = updateKeys.filter((key) => !allowedUpdates.includes(key));

    if (invalidFields.length > 0) {
        throw new ApiError(`You can only update these fields: [${allowedUpdates.join(', ')}]`, 400);
    }

    const updates = Object.fromEntries(
        Object.entries(updateData).filter(([key]) => allowedUpdates.includes(key))
    );

    if (updates.isPaid) {
        updates.paidAt = Date.now();
    }

    if (updates.isDelivered) {
        updates.deliveredAt = Date.now();
    }

    const order = await Order.findByIdAndUpdate(orderId, updates, {
        new: true,
        runValidators: true
    });

    if (!order) {
        throw new ApiError('Order not found.', 404);
    }

    return order;
};

export const deleteOrderService = async (user, orderId) => {
    const order = await Order.findById(orderId);
    if (!order) {
        throw new ApiError('Order not found.', 404);
    }

    if (user.role === 'seller') {
        const isSellerAuthorized = order.cartItems.every(item =>
            item.product?.seller?.toString() === user._id.toString()
        );

        if (!isSellerAuthorized) {
            throw new ApiError('You can only cancel orders containing your own products.', 403);
        }
    }

    if (user.role === 'user') {
        if (order.user.toString() !== user._id.toString()) {
            throw new ApiError('Unauthorized to delete this order.', 403);
        }

        const orderTime = new Date(order.createdAt);
        const currentTime = new Date();
        const timeDifference = (currentTime - orderTime) / (1000 * 60 * 60);

        if (timeDifference > 1) {
            throw new ApiError('You can only delete orders within 1 hour.', 400);
        }
    }

    const bulkOption = order.cartItems.map((item) => ({
        updateOne: {
            filter: { _id: item.product },
            update: { $inc: { quantity: +item.amount, sold: -item.amount } }
        }
    }));
    await Product.bulkWrite(bulkOption, {});

    await Order.findByIdAndDelete(orderId);

    return true;
};

export const checkoutSession = async (req) => {
    try {
        const { cartId } = req.params;
        const cart = await Cart.findById(cartId).populate("cartItems.product");

        if (!cart) {
            throw new ApiError(`Cart not found`, 404);
        }

        if (cart.cartItems.length === 0) {
            throw new ApiError(`Cart is empty`, 400);
        }

        const shippingPrice = 0;
        const cartPrice = cart.totalPriceAfterDiscount ?? cart.totalCartPrice ?? 0;
        const totalOrderPrice = cartPrice + shippingPrice;

        if (isNaN(totalOrderPrice) || totalOrderPrice <= 0) {
            throw new ApiError('Invalid total order price', 400);
        }

        if (!process.env.STRIPE_SECRET_KEY) {
            throw new ApiError('Stripe secret key is not configured', 500);
        }

        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price_data: {
                    currency: 'egp',
                    product_data: {
                        name: `Order from ${req.user.userName}`,
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
                firstName: `${req.body.billingInfo?.firstName || ''}`,
                lastName: `${req.body.billingInfo?.lastName || ''}`,
                addressLine: `${req.body.billingInfo?.addressLine || ''}`,
                company: `${req.body.billingInfo?.company || ''}`,
                country: `${req.body.billingInfo?.country || ''}`,
                state: `${req.body.billingInfo?.state || ''}`,
                city: `${req.body.billingInfo?.city || ''}`,
                zipCode: `${req.body.billingInfo?.zipCode || ''}`,
                email: `${req.body.billingInfo?.email || ''}`,
                phoneNumber: `${req.body.billingInfo?.phoneNumber || ''}`,
            },
        });

        return {
            success: true,
            session
        };
    } catch (error) {
        console.error('Stripe session creation error:', error);
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError(error.message || 'Failed to create checkout session', error.statusCode || 500);
    }
};

const createCardOrder = async (session) => {
    try {
        const cartId = session.client_reference_id;
        const orderPrice = session.amount_total / 100;

        const cart = await Cart.findById(cartId);
        if (!cart) {
            console.error(`Cart not found for session: ${session.id}`);
            return null;
        }

        const user = await User.findOne({ email: session.customer_email });
        if (!user) {
            console.error(`User not found for email: ${session.customer_email}`);
            return null;
        }

        const order = await Order.create({
            user: user._id,
            orderID: Math.floor(100000 + Math.random() * 900000).toString(),
            cartItems: cart.cartItems,
            billingInfo: session.metadata,
            totalOrderPrice: orderPrice,
            isPaid: true,
            paidAt: Date.now(),
            paymentMethodType: 'card',
            status: 'processing'
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
            return order;
        }
    } catch (error) {
        console.error('Error creating card order:', error);
        return null;
    }
};

export const webhookCheckout = async (req) => {
    const sig = req.headers['stripe-signature'];

    if (!sig) {
        throw new ApiError('Missing stripe-signature header', 400);
    }

    let event;

    try {
        event = Stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_KEY
        );
    } catch (err) {
        console.error('Webhook signature verification failed:', err);
        throw new ApiError(`Webhook Error: ${err.message}`, 400);
    }

    if (event.type === 'checkout.session.completed') {
        const order = await createCardOrder(event.data.object);

        if (!order) {
            console.error('Failed to create order from webhook:', event.data.object);
            throw new ApiError('Failed to create order', 500);
        }
    }

    return {
        success: true,
        received: true
    };
};