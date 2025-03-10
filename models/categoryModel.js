import mongoose from "mongoose";

const categorySchema = mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            unique: [true, 'Category must be unique'],
        },
        slug: {
            type: String,
            lowercase: true
        },
        categoryImage: {
            type: String,
            required: true
        },
    },
    { timestamps: true }
);

export default mongoose.model('Category', categorySchema);