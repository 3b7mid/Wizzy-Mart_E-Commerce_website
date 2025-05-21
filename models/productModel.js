import mongoose from "mongoose";

const productSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        slug: {
            type: String,
            lowercase: true
        },
        description: {
            type: String
        },
        seller: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        sku: {
            type: String,
            trim: true
        },
        model: {
            type: String
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category'
        },
        subCategory: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'SubCategory'
        },
        brand: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Brand'
        },
        price: Number,
        priceAfterDiscount: Number,
        discountPercent: {
            type: Number,
            default: 0
        },
        quantity: {
            type: Number,
            default: 1
        },
        sold: {
            type: Number,
            default: 0
        },
        availability: {
            type: String,
            enum: ['in stock', 'out of stock'],
            default: 'in stock'
        },
        ratingsAverage: {
            type: Number,
            default: 0
        },
        ratingsQuantity: {
            type: Number,
            default: 0
        },
        imageCover: {
            type: String
        },
        images: [String],
        colors: [String],
        size: [String],
        memory: [String],
        weight: String,
        storage: [String],
        features: [String],
        tags: [String],
        shippingInfo: [String]
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

productSchema.virtual('reviews', {
    ref: 'Review',
    foreignField: 'product',
    localField: '_id'
});

productSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'category subCategory brand',
        select: '_id name'
    }).populate({
        path: 'reviews',
        select: 'ratings feedback user'
    });
    next();
});

export default mongoose.model('Product', productSchema);
