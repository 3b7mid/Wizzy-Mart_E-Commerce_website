import express from 'express';
import { protect, allowedTo } from '../services/authService.js';
import { checkoutSessionValidator, createOrderValidator, deleteOrderValidator, updateOrderValidator, updateShippingPriceValidator } from '../validators/orderValidator.js';
import { createCashOrder, getAllUserOrders, getAllOrders, deleteOrder, checkoutSession, updateOrderToPaid, updateOrderToDelivered, updateGlobalShippingPrice, updateShippingPrice } from '../services/orderService.js';

const router = express.Router();

// router.route('/direct-order')
//     .post(protect, allowedTo('user'), createOrderValidator, createDirectOrder);

router.route('/:cartId')
    .post(protect, allowedTo('user'), createOrderValidator, createCashOrder);

router.route('/my-orders')
    .get(protect, allowedTo('user'), getAllUserOrders);

router.route('/')
    .get(protect, allowedTo('admin'), getAllOrders);

router.route('/global-shipping')
    .put(protect, allowedTo('admin'), updateShippingPriceValidator, updateGlobalShippingPrice);

router.route('/:id/shipping')
    .put(protect, allowedTo('admin'), updateShippingPriceValidator, updateShippingPrice);

router.route('/:orderId/pay')
    .put(protect, allowedTo('admin'), updateOrderValidator, updateOrderToPaid);

router.route('/:orderId/deliver')
    .put(protect, allowedTo('admin'), updateOrderValidator, updateOrderToDelivered)

router.route('/:orderId')
    .delete(protect, allowedTo('user', 'admin'), deleteOrderValidator, deleteOrder);

router.route('/checkout-session/:cartId')
    .get(protect, allowedTo('user'), checkoutSessionValidator, checkoutSession);

export default router;