import mongoose from 'mongoose';
import Product from './productModel.js';

const reviewSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            trim: true
        },
        ratings: {
            type: Number
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        },
    },
    { timestamps: true }
);

reviewSchema.pre(/^find/, function (next) {
    this.populate({ path: 'user', select: 'name' });
    next();
});

reviewSchema.statics.calcAverageRatingsAndQuantity = async function (
    productId
) {
    const result = await this.aggregate([
        {
            $match: { product: productId },
        },
        {
            $group: {
                _id: 'product',
                avgRatings: { $avg: '$ratings' },
                ratingsQuantity: { $sum: 1 },
            },
        },
    ]);

    if (result.length > 0) {
        await Product.findByIdAndUpdate(productId, {
            ratingsAverage: result[0].avgRatings,
            ratingsQuantity: result[0].ratingsQuantity,
        });
    } else {
        await Product.findByIdAndUpdate(productId, {
            ratingsAverage: 0,
            ratingsQuantity: 0,
        });
    }
};

reviewSchema.post('save', async function () {
    await this.constructor.calcAverageRatingsAndQuantity(this.product);
});

// When a review is updated
reviewSchema.post('findOneAndUpdate', async function (doc) {
    if (doc) {
        await doc.constructor.calcAverageRatingsAndQuantity(doc.product);
    }
});

// When a review is deleted
reviewSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await doc.constructor.calcAverageRatingsAndQuantity(doc.product);
    }
});

export default mongoose.model('Review', reviewSchema);