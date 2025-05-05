import mongoose from "mongoose";
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
        },
        email: {
            type: String,
            trim: true,
            lowercase: true
        },
        password: {
            type: String,
            trim: true,
        },
        googleId: {
            type: String,
            unique: true,
            sparse: true,
        },
        role: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user'
        },
        wishlist: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product'
            }
        ],
        addresses: [
            {
                id: { type: mongoose.Schema.Types.ObjectId },
                alias: String,
                details: String,
                phone: String,
                city: String,
                postalCode: String
            }
        ],
        active: {
            type: Boolean,
            default: true
        },
        passwordChangedAt: Date,
        passwordResetCode: {
            type: String,
            unique: true,
            sparse: true,
            index: true,
        },
        passwordResetExpiresAt: Date,
        passwordResetVerified: Boolean,
        isVerified: Boolean,
        verificationCode: {
            type: String,
            unique: true,
            sparse: true,
            index: true,
        },
        verificationCodeExpiresAt: Date
    },
    { timestamps: true },
);

userSchema.index({ email: 1 });

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);

    next();
});

export default mongoose.model('User', userSchema);