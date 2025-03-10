import mongoose from "mongoose";

const subCategorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            unique: [true, 'subCategory already exists'],
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

export default mongoose.model('SubCategory', subCategorySchema);