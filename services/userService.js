import asyncHandler from 'express-async-handler';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import ApiError from '../utils/apiError.js';
import ApiFeatures from '../utils/apiFeatures.js';
import { sendVerificationEmail } from '../utils/sendEmails/emails.js';
import { sanitizeUser } from '../utils/sanitizeData.js';
import User from '../models/userModel.js';

// @desc    Get all Users
// @route   GET /api/users
// @access  Private/Admin
export const getUsers = asyncHandler(async (req, res) => {
    const totalUsers = await User.countDocuments({ role: { $ne: 'admin' } });

    const features = new ApiFeatures(User.find({ role: { $ne: 'admin' } }), req.query)
        .filter()
        .sort()
        .limitFields()
        .search(['name', 'email'])
        .paginate(totalUsers);

    const users = await features.mongooseQuery.exec();

    res.status(200).json({
        success: true,
        pagination: features.paginationResult,
        data: users.map(sanitizeUser)
    });
});

// @desc    Get a user
// @route   GET /api/users/:id
// @access  Private/Admin
export const getUser = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
        return next(new ApiError(`No user for this id: ${id}`, 404));
    }

    res.status(200).json({
        data: sanitizeUser(user)
    });
});

// @desc    Delete a user
// @route   Delete /api/users/:id
// @access  Private/Admin
export const deleteUser = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);

    if (!user) {
        return next(new ApiError(`No user for this id: ${id}`, 404));
    }

    res.status(200).end();
});

// @desc    Get Logged user data
// @route   GET /api/users/getMe
// @access  Private/Protect
export const getLoggedUserData = asyncHandler(async (req, res, next) => {
    req.params.id = req.user._id;
    next();
});

// @desc    Update logged user data (without password, role)
// @route   PUT /api/users/updateMe
// @access  Private/Protect
export const updateLoggedUserData = asyncHandler(async (req, res, next) => {
    const allowedUpdates = ['name', 'email'];
    const updates = Object.fromEntries(
        Object.entries(req.body).filter(([key]) => allowedUpdates.includes(key))
    );

    let verificationCode;

    if (updates.email) {
        const existingUser = await User.findOne({ email: updates.email });
        if (existingUser && existingUser._id.toString() !== req.user._id.toString()) {
            return next(new ApiError('Email is already in use by another account', 400));
        }

        verificationCode = crypto.randomInt(100000, 999999).toString();
        updates.verificationCode = crypto.createHash('sha256').update(verificationCode).digest('hex');
        updates.verificationCodeExpiresAt = new Date(Date.now() + 60 * 60 * 1000);
        updates.isVerified = false;
    }

    const updatedUser = await User.findByIdAndUpdate(req.user._id, updates, {
        new: true,
        runValidators: true
    });

    if (updates.email) {
        try {
            await sendVerificationEmail(updatedUser.email, updatedUser.name, verificationCode);
        } catch (err) {
            updatedUser.verificationCode = undefined;
            updatedUser.verificationCodeExpiresAt = undefined;
            updatedUser.isVerified = true;
            await updatedUser.save();
            return next(new ApiError('Failed to send verification email. Please try again.', 500));
        }
    }

    res.status(200).json({
         message: updates.email ? 'Email updated. Please verify your new email.' : 'Profile updated.',
        data: sanitizeUser(updatedUser)
    });
});

// @desc    Change user password
// @route   PUT /api/users/:id
// @access  Private/User
export const changePassword = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.params.userId);

    if (!user) {
        return next(new ApiError(`User Not found`, 404));
    }

    user.password = req.body.password;
    user.passwordChangedAt = new Date();
    await user.save();

    res.status(200).json({
        status: 'success',
        message: 'Password changed successfully'
    });
});