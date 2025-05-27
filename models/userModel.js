import mongoose from "mongoose";
import bcrypt from 'bcrypt';

export const addressSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['billing', 'shipping']
    },
    firstName: String,
    lastName: String,
    companyName: String,
    addressLine: String,
    country: String,
    state: String,
    city: String,
    zipCode: String,
    email: String,
    phoneNumber: String,
}, { _id: true });

const userSchema = new mongoose.Schema(
    {
        displayName: {
            type: String,
            trim: true
        },
        userName: {
            type: String,
            trim: true
        },
        fullName: {
            type: String,
            trim: true
        },
        email: {
            type: String,
            lowercase: true,
            trim: true
        },
        secondaryEmail: {
            type: String,
            lowercase: true,
            trim: true
        },
        phoneNumber: String,
        country: String,
        states: String,
        city: String,
        zipCode: String,
        password: {
            type: String,
            trim: true
        },
        profileImage: {
            type: String,
            default: 'https://ui-avatars.com/api/?name=User&background=ddd&color=555'
        },
        role: {
            type: String,
            enum: ['user', 'seller', 'admin'],
            default: 'user'
        },
        wishlist: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product'
            }
        ],
        addresses: [addressSchema],
        active: {
            type: Boolean,
            default: true
        },
        isVerified: Boolean,
        verificationCode: {
            type: String,
            unique: true,
            sparse: true,
            index: true,
        },
        verificationCodeExpiresAt: Date,
        passwordResetCode: {
            type: String,
            unique: true,
            sparse: true,
            index: true,
        },
        passwordResetExpiresAt: Date,
        passwordResetVerified: {
            type: Boolean,
            default: false,
        },
        passwordChangedAt: Date
    },
    { timestamps: true },
);

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);

    next();
});

export default mongoose.model('User', userSchema);