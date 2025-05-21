import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    },
    amount: {
        type: Number,
        default: 1
    },
    price: Number,
    color: String,
}, { _id: false });

const cartSchema = mongoose.Schema(
    {
        cartItems: [cartItemSchema],
        totalCartPrice: Number,
        totalPriceAfterDiscount: Number,
        coupon: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Coupon'
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        status: {
            type: String,
            enum: ['active', 'converted', 'abandoned'],
            default: 'active'
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

cartSchema.index({ user: 1, status: 1 });
cartSchema.index({ createdAt: 1 }, { expireAfterSeconds: 604800 });

cartSchema.virtual('totalItems').get(function () {
    return this.cartItems.reduce((total, item) => total + item.amount, 0);
});

cartSchema.virtual('savings').get(function () {
    if (!this.totalPriceAfterDiscount) return 0;
    return this.totalCartPrice - this.totalPriceAfterDiscount;
});

cartSchema.pre('save', function (next) {
    if (this.totalPriceAfterDiscount && this.totalPriceAfterDiscount > this.totalCartPrice) {
        this.totalPriceAfterDiscount = this.totalCartPrice;
    }
    next();
});

export default mongoose.model('Cart', cartSchema);