import mongoose from "mongoose";

const brandSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true
        },
        slug: {
            type: String,
            lowercase: true
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category'
        },
        subCategory: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'SubCategory'
        }
    },
    { timestamps: true }
);

brandSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'category subCategory',
        select: '_id name'
    });
    next();
});

export default mongoose.model('Brand', brandSchema);