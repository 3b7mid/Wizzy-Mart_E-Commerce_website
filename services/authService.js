import 'dotenv/config';
import asyncHandler from 'express-async-handler';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import slugify from 'slugify';
import { createToken } from '../utils/createToken.js';
import ApiError from '../utils/apiError.js';
import { sanitizeUser } from '../utils/sanitizeData.js';
import { sendPasswordResetEmail, sendVerificationEmail } from '../utils/sendEmails/emails.js';
import User from '../models/userModel.js';


// @desc    Signup
// @route   POST /api/auth/signup
// @access  Public
export const signup = asyncHandler(async (req, res, next) => {

    const verificationCode = crypto.randomInt(100000, 999999).toString();
    const verificationCodeExpiresAt = Date.now() + 60 * 60 * 1000;

    const user = await User.create({
        name: req.body.name,
        slug: slugify(req.body.name),
        email: req.body.email,
        password: req.body.password,
        profileImage: req.body.profileImage,
        isVerified: false,
        verificationCode,
        verificationCodeExpiresAt
    });

    if (!user) {
        return next(new ApiError('User creation failed', 500));
    }

    try {
        await sendVerificationEmail(user.email, user.name, verificationCode);
    } catch (error) {
        user.passwordResetCode = undefined;
        user.passwordResetExpiresAt = undefined;
        user.passwordResetVerified = undefined;
        await user.save();
        return next(new ApiError('Failed to send verification code email. Please try again.', 500));
    }

    res.status(201).json({
        status: 'success',
        message: 'Verification code sent to your email. Please verify your account'
    });
});
// @desc    Verify Email
// @route   POST /api/auth/verify-email
// @access  Public
export const verifyEmail = asyncHandler(async (req, res, next) => {
    const { email, verificationCode } = req.body;

    const user = await User.findOne({
        email,
        verificationCode,
        verificationCodeExpiresAt: { $gt: Date.now() }
    });

    if (!user) {
        return next(new ApiError('Invalid or expired verification code', 400));
    }
    
    user.isVerified = true;
    user.verificationCode = undefined;
    user.verificationCodeExpiresAt = undefined;
    await user.save();

    res.status(200).json({ 
        status: 'success',
        message: 'Email verified successfully. You can now log in.',
    });
});


// @desc    Login
// @route   POST /api/auth/login
// @access  Public
export const login = asyncHandler(async (req, res, next) => {

    const user = await User.findOne({ email: req.body.email });
    if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
        return next(new ApiError('Incorrect email or password', 401));
    }

    const token = createToken(user._id, res);
    delete user.password;

    res.status(200).json({ data: sanitizeUser(user), token });
});

// @desc    Deactivate logged user
// @route   DELETE /api/users/logout
// @access  Private/Protect
export const logout = asyncHandler(async (req, res, next) => {
    await User.findByIdAndUpdate(req.user._id, { active: false });

    res.status(204).end();
});

// @desc    Make sure the user is loggde in
export const protect = asyncHandler(async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
        return next(new ApiError('You are not login, Please login to get access this route', 401));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const currentUser = await User.findById(decoded.userId);
    if (!currentUser) {
        return next(new ApiError('No user found with this id', 404));
    }

    if (currentUser.passwordChangedAt) {
        const passChangedTimestamp = parseInt(currentUser.passwordChangedAt.getTime() / 1000, 10);

        if (passChangedTimestamp > decoded.iat) {
            return next(new ApiError('User recently changed his password. please login again...', 401));
        }
    }
    req.user = currentUser;
    next();
});

// @desc    Restrict access to specific roles
export const allowedTo = (...roles) =>
    asyncHandler(async (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new ApiError('You are not allowed to access this route', 403));
        }

        next();
    });

// @desc    Forget Password
// @route   POST/ api/auth/forget-password
// @access  Public
export const forgetPassword = asyncHandler(async (req, res, next) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(200).json({
            success: true,
            message: "If your email is registered, you'll receive a password reset link shortly.",
        });
    }

    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const resetCodeExpiresAt = Date.now() + 10 * 60 * 1000; // 10 min
    const hashedResetCode = crypto
        .createHash('sha256')
        .update(resetCode)
        .digest('hex');

    user.passwordResetCode = hashedResetCode;
    user.passwordResetExpiresAt = resetCodeExpiresAt;
    user.passwordResetVerified = false;
    await user.save();

    try {
        await sendPasswordResetEmail(user.email, user.name, resetCode);
    } catch (error) {
        user.passwordResetCode = undefined;
        user.passwordResetExpiresAt = undefined;
        user.passwordResetVerified = undefined;
        await user.save();
        return next(new ApiError('Failed to send password reset email. Please try again.', 500));
    }

    res.status(200).json({
        success: true,
        message: 'Password reset code sent to your email',
    });
});

// @desc    Verify Password Reset Code
// @route   POST/ api/auth/verify-resetCode
// @access  Public
export const verifyResetToken = asyncHandler(async (req, res, next) => {
    const { resetCode } = req.body;
    const hashedResetCode = crypto
        .createHash('sha256')
        .update(resetCode)
        .digest('hex');

    const user = await User.findOne({ passwordResetCode: hashedResetCode });

    if (!user || user.passwordResetExpiresAt < Date.now()) {
        return next(new ApiError('Reset code invalid or expired', 400));
    }

    user.passwordResetVerified = true;
    await user.save();

    res.status(200).json({
        status: 'Success'
    });
});

// @desc    Reset Password
// @route   POST/ api/auth/reset-password
// @access  Public
export const resetPassword = asyncHandler(async (req, res, next) => {
    const { email, newPassword } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
        return next(new ApiError("Invalid User email", 404));
    }

    if (!user.passwordResetVerified) {
        return next(new ApiError('Reset code not verified', 400));
    }

    user.password = newPassword;

    user.passwordResetCode = undefined;
    user.passwordResetExpiresAt = undefined;
    user.passwordResetVerified = undefined

    await user.save();

    //const token = createToken(user._id, res);
    //res.status(200).json({ token });

    res.status(200).json({
        stasus: 'Success',
        message: 'Password has been reset successfully. Please log in with your new password.'
    });
});