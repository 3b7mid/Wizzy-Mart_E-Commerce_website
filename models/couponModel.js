import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
    {
        code: {
            type: String,
            uppercase: true,
            trim: true,
        },
        discount: Number,
        expiresAt: Date,
        type: {
            type: String,
            enum: ['percentage', 'fixed'],
            default: 'percentage'
        },
        minPurchase: {
            type: Number,
            default: 0
        },
        maxDiscount: Number,
        categories: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category'
        }],
        products: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        }],
        description: {
            type: String,
            trim: true,
            maxlength: [500, 'Description cannot exceed 500 characters']
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Creator is required']
        }
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

couponSchema.index({ code: 1 });
couponSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
couponSchema.index({ createdBy: 1 });

couponSchema.virtual('isExpired').get(function () {
    return new Date() > this.expiresAt;
});

couponSchema.methods.canBeUsed = function (totalAmount) {
    if (totalAmount < this.minPurchase) return false;
    return true;
};

couponSchema.methods.calculateDiscount = function (totalAmount) {
    if (!this.canBeUsed(totalAmount)) return 0;

    let discountAmount;
    if (this.type === 'percentage') {
        discountAmount = (totalAmount * this.discount) / 100;
    } else {
        discountAmount = this.discount;
    }

    if (this.maxDiscount) {
        discountAmount = Math.min(discountAmount, this.maxDiscount);
    }

    discountAmount = Math.min(discountAmount, totalAmount);

    return Number(discountAmount.toFixed(2));
};

couponSchema.pre('save', function (next) {
    if (this.type === 'percentage' && this.maxDiscount) {
        const maxPossibleDiscount = (this.minPurchase * this.discount) / 100;
        this.maxDiscount = Math.min(this.maxDiscount, maxPossibleDiscount);
    }
    next();
});

export default mongoose.model('Coupon', couponSchema);