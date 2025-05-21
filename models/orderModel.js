import mongoose from 'mongoose';
import { addressSchema } from './userModel.js';

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    orderID: {
        type: String,
        unique: true,
        sparse: true,
    },
    cartItems: {
        type:
            [
                {
                    product: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: 'Product'
                    },
                    amount: {
                        type: Number,
                        default: 1
                    },
                    price: Number,
                    color: String
                }
            ],
    },
    billingInfo: addressSchema,
    orderNotes: String,
    shippingPrice: {
        type: Number,
        default: 0
    },
    totalOrderPrice: {
        type: Number
    },
    totalOrderPriceAfterDiscount: {
        type: Number
    },
    paymentMethodType: {
        type: String,
        enum: ['card', 'cash']
    },
    status: {
        type: String,
        enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'],
        default: 'pending'
    },
    isPaid: {
        type: Boolean,
        default: false
    },
    paidAt: {
        type: Date
    },
    isDelivered: {
        type: Boolean
    },
    deliveredAt: {
        type: Date
    },
},
    { timestamps: true }
);

export default mongoose.model('Order', orderSchema);