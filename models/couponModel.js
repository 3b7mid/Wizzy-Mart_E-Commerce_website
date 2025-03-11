import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
    {
        code: {
            type: String,
            trim: true,
            uniuqe: true
        },
        discount: {
            type: Number
        },
        expiresAt: {
            type: Date
        }
    },
    { timestamps: true }
);

export default mongoose.model('Coupon', couponSchema);