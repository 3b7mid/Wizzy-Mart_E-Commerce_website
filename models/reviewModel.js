import mongoose from 'mongoose';
import Product from '../models/productModel.js';

const reviewSchema = new mongoose.Schema(
    {
        ratings: {
            type: Number
        },
        feedback: {
            type: String,
            trim: true
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        }
    },
    { 
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

reviewSchema.index({ product: 1, createdAt: -1 });
reviewSchema.index({ user: 1, createdAt: -1 });

reviewSchema.pre(/^find/, function (next) {
    this.populate({ 
        path: 'user', 
        select: 'userName profileImage' 
    });
    next();
});

reviewSchema.statics.calcAverageRatingsAndQuantity = async function (productId) {
    const result = await this.aggregate([
        {
            $match: { product: productId }
        },
        {
            $group: {
                _id: 'product',
                avgRatings: { $avg: '$ratings' },
                ratingsQuantity: { $sum: 1 }
            }
        }
    ]);

    if (result.length > 0) {
        await Product.findByIdAndUpdate(productId, {
            ratingsAverage: Math.round(result[0].avgRatings * 10) / 10,
            ratingsQuantity: result[0].ratingsQuantity,
        });
    } else {
        await Product.findByIdAndUpdate(productId, {
            ratingsAverage: 0,
            ratingsQuantity: 0
        });
    }
};

reviewSchema.post('save', async function () {
    await this.constructor.calcAverageRatingsAndQuantity(this.product);
});

reviewSchema.post('findOneAndUpdate', async function (doc) {
    if (doc) {
        await doc.constructor.calcAverageRatingsAndQuantity(doc.product);
    }
});

reviewSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await doc.constructor.calcAverageRatingsAndQuantity(doc.product);
    }
});

reviewSchema.virtual('timeElapsed').get(function() {
    const now = new Date();
    const created = new Date(this.createdAt);
    const diffTime = Math.abs(now - created);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
});

export default mongoose.model('Review', reviewSchema);