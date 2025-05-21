import mongoose from "mongoose";

const categorySchema = mongoose.Schema(
    {
        name: {
            type: String,
            trim: true
        },
        slug: {
            type: String,
            lowercase: true
        },
        categoryImage: String
    },
    { timestamps: true }
);

export default mongoose.model('Category', categorySchema);