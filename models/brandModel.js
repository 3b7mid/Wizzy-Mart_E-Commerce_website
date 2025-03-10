import mongoose from "mongoose";

const brandSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            unique: [true, 'Brand already exists'],
        },
        slug: {
            type: String,
            lowercase: true
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category'
        },
        subCategories: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'SubCategory'
        }]
    },
    { timestamps: true }
);

brandSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'category subCategories',
        select: 'name _id'
    });
    next();
});

export default mongoose.model('Brand', brandSchema);