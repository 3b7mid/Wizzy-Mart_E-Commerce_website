import mongoose from "mongoose";

const productSchema = mongoose.Schema(
    {
        title: {
            type: String,
            trim: true,
            unique: [true, 'Category must be unique'],
        },
        slug: {
            type: String,
            lowercase: true
        },
        description: {
            type: String
        },
        quantity: {
            type: Number,
            default: 1
        },
        sold: {
            type: Number,
            default: 0
        },
        price: {
            type: Number,
            trim: true
        },
        priceAfterDiscount: {
            type: Number
        },
        colors: [String],
        imageCover: {
            type: String
        },
        images: [String],
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category'
        },
        subCategories: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'SubCategory'
        }],
        brand: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Brand'
        },
        ratingsAverage: {
            type: Number,
            default: 0
        },
        ratingsQuantity: {
            type: Number,
            default: 0
        }
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
        path: 'category subCategories brand',
        select: 'name _id'
    });
    this.populate({
        path: 'reviews',
        select: 'title ratings user'
    });
    next();
});

export default mongoose.model('Product', productSchema);