import mongoose from "mongoose";
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
        },
        slug: {
            type: String,
            lowercase: true
        },
        email: {
            type: String,
            trim: true,
            lowercase: true
        },
        profileImage: {
            type: String,
            default: 'https://ui-avatars.com/api/?name=User&background=ddd&color=555'
        },
        password: {
            type: String,
            trim: true
        },
        role: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user'
        },
        wishlist: [
            {
                type : mongoose.Schema.Types.ObjectId,
                ref : 'Product'
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
        passwordResetCode: String,
        passwordResetExpiresAt: Date,
        passwordResetVerified: Boolean,
        isVerified: Boolean,
        verificationCode: String,
        verificationCodeExpiresAt: Date
    },
    { timestamps: true },
);

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);

    next();
});

export default mongoose.model('User', userSchema);