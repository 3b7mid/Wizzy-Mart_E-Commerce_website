import express from 'express';
import { protect, allowedTo } from '../middlewares/authMiddleware.js';
import { createOrderValidator, orderIDValidator } from '../validators/orderValidator.js';
import { createCashOrder, getOrders, getOrder, updateOrderDetails, deleteOrder, createCheckoutSession, handleWebhookCheckout } from '../controllers/orderController.js';

const router = express.Router();

router.route('/:cartId')
    .post(protect, allowedTo('user'), createOrderValidator, createCashOrder);

router.route('/my-orders')
    .get(protect, allowedTo('user'), getOrders);

router.route('/seller-orders')
    .get(protect, allowedTo('seller'), getOrders);

router.route('/')
    .get(protect, allowedTo('admin'), getOrders);

router.route('/my-orders/:orderId')
    .get(protect, allowedTo('user'), orderIDValidator, getOrder);

router.route('/seller-orders/:orderId')
    .get(protect, allowedTo('seller'), orderIDValidator, getOrder);

router.route('/:orderId')
    .get(protect, allowedTo('admin'), orderIDValidator, getOrder)
    .put(protect, allowedTo('admin'), orderIDValidator, updateOrderDetails)
    .delete(protect, allowedTo('user', 'admin', 'seller'), orderIDValidator, deleteOrder);

router.route('/checkout-session/:cartId')
    .get(protect, allowedTo('user'), createOrderValidator, createCheckoutSession);

router.route('/webhook-checkout')
    .post(handleWebhookCheckout);

export default router;