import mongoose from 'mongoose';

const cartSchema = mongoose.Schema(
    {
        cartItems: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Product'
                },
                amount: {
                    type: Number,
                    default: 1,
                },
                price: {
                    type: Number
                },
                color: String
            }
        ],
        totalCartPrice: {
            type: Number,
            default: 0
        },
        totalPriceAfterDiscount: {
            type: Number,
            default: 0
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        createdAt: {
            type: Date,
            default: Date.now,
            expires: '7d'
        }
    },
    { timestamps: true }
);

export default mongoose.model('Cart', cartSchema);