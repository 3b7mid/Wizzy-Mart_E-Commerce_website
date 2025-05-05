import 'dotenv/config';
import asyncHandler from 'express-async-handler';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import { createToken } from '../utils/createToken.js';
import { OAuth2Client } from 'google-auth-library';
import ApiError from '../utils/apiError.js';
import { sanitizeUser } from '../utils/sanitizeData.js';
import { sendPasswordResetEmail, sendVerificationEmail } from '../utils/sendEmails/emails.js';
import User from '../models/userModel.js';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
// @desc   Log in with Google
// @route  POST /api/auth/google
// @access Private
export const googleLogin = asyncHandler(async (req, res) => {
    const { id_token } = req.body;
    console.log("Received token:", id_token);
    console.log("Expected audience:", process.env.GOOGLE_CLIENT_ID);

    const ticket = await client.verifyIdToken({
        idToken: id_token,
        audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name } = payload;

    let user = await User.findOne({ email });

    if (!user) {
        user = await User.create({
            email,
            name,
            isVerified: true
        });
    } else {
        if (!user.isVerified) {
            user.isVerified = true;
            await user.save();
        }
    }

    const token = createToken(user._id, res);

    res.json({
        success: true,
        token,
        user: {
            id: user._id,
            email,
            name,
        },
    });
});

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI;

export const googleOAuthCallback = asyncHandler(async (req, res) => {
    const { code } = req.query;

    if (!code) {
        res.status(400);
        throw new Error("Authorization code not provided");
    }

    // Step 1: Exchange code for tokens
    const tokenResponse = await axios.post("https://oauth2.googleapis.com/token", {
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: GOOGLE_REDIRECT_URI,
        grant_type: "authorization_code",
    });

    const { id_token } = tokenResponse.data;

    // Step 2: Decode ID token to get user info
    const decoded = jwt.decode(id_token);
    if (!decoded) {
        res.status(401);
        throw new Error("Failed to decode ID token");
    }

    const { email, name, picture, sub: googleId } = decoded;

    // Step 3: Find or create user
    let user = await User.findOne({ email });

    if (!user) {
        user = await User.create({
            name,
            email,
            profilePicture: picture,
            googleId,
            password: null, // Google users don't need a local password
        });
    }

    // Step 4: Create JWT and set it as HTTP-only cookie
    createToken(user._id, res);

    // Step 5: Return response
    res.status(200).json({
        message: "Google login successful",
        user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            profilePicture: user.profilePicture,
        },
    });
});

// @desc    Signup
// @route   POST /api/auth/signup
// @access  Public
export const signup = asyncHandler(async (req, res, next) => {

    const verificationCode = crypto.randomInt(100000, 999999).toString();
    const verificationCodeExpiresAt = new Date(Date.now() + 60 * 60 * 1000);
    const hashedverificationCode = crypto
        .createHash('sha256')
        .update(verificationCode)
        .digest('hex');

    const user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        isVerified: false,
        verificationCode: hashedverificationCode,
        verificationCodeExpiresAt
    });

    if (!user) {
        return next(new ApiError('User creation failed', 500));
    }

    try {
        await sendVerificationEmail(user.email, user.name, verificationCode);
    } catch (error) {
        user.verificationCode = undefined;
        user.verificationCodeExpiresAt = undefined;
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
    const { verificationCode } = req.body;

    if (!verificationCode) {
        return next(new ApiError('Verification code is required', 400));
    }

    const hashedVerificationCode = crypto
        .createHash('sha256')
        .update(verificationCode)
        .digest('hex');

    const user = await User.findOne({
        verificationCode: hashedVerificationCode,
        verificationCodeExpiresAt: { $gt: Date.now() },
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
    if (!(await bcrypt.compare(req.body.password, user.password))) {
        return next(new ApiError('Incorrect email or password', 401));
    }

    user.active = true;
    user.save();
    const token = createToken(user._id, res);

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

    const resetCode = crypto.randomInt(100000, 999999).toString();
    const resetCodeExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
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