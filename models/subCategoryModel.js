import mongoose from "mongoose";

const subCategorySchema = new mongoose.Schema(
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
        }
    },
    { timestamps: true }
);

subCategorySchema.pre(/^find/, function (next) {
    this.populate({
        path: 'category',
        select: '_id name'
    });
    next();
});

export default mongoose.model('SubCategory', subCategorySchema);