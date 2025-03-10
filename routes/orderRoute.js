import express from 'express';
import { createOrderValidator, deleteOrderValidator } from '../middlewares/orderMiddleware.js';
import { createDirectOrder, createCashOrder, getAllUserOrders, getAllOrders, deleteOrder, checkoutSession } from '../services/orderService.js';
import { protect, allowedTo } from '../services/authService.js';

const router = express.Router();

router.route('/direct-order')
    .post(protect, allowedTo('user'), createOrderValidator, createDirectOrder);

router.route('/:cartId')
    .post(protect, allowedTo('user'), createCashOrder);

router.route('/my-orders')
    .get(protect, allowedTo('user'), getAllUserOrders);

router.route('/')
    .get(protect, allowedTo('admin'), getAllOrders);

router.route('/:orderId')
    .delete(protect, allowedTo('user', 'admin'), deleteOrderValidator, deleteOrder);

router.route('/checkout-session/:cartId')
    .get(protect, allowedTo('user'), checkoutSession);

export default router;