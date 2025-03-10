import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
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
                    price: {
                        type: Number,
                    },
                    color: String
                }
            ],
    },
    shippingAddress: {
        address: String,
        phone: String,
        city: String,
        zipCode: String
    },
    shippingPrice: {
        type: Number,
        default: 0
    },
    totalOrderPrice: {
        type: Number
    },
    totalPriceAfterDiscount: {
        type: Number
    },
    paymentMethodType: {
        type: String,
        enum: ['card', 'cash']
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