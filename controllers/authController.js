import asyncHandler from "express-async-handler";
import { sanitizeUser } from "../utils/sanitizeData.js";
import { generateToken } from '../utils/tokens.js';
import { signupService, resendVerificationCodeService, verifyEmailService, loginService, logoutService, forgetPasswordService, resetPasswordService, updateMeService, changePasswordService } from "../services/authService.js";

// @desc    Signup
// @route   POST /api/auth/signup
// @access  Public
export const signup = asyncHandler(async (req, res) => {
    await signupService(req.body);

    res.status(201).json({
        success: true,
        message: "Verification code sent to your email. Please verify your account."
    });
});

// @desc    Resend Verification code
// @route   POST /api/auth/resend-verificationCode
// @access  Private
export const resendVerificationCode = asyncHandler(async (req, res) => {
    const { email } = req.body;

    await resendVerificationCodeService(email);

    return res.status(200).json({
        success: true,
        message: "Verification code sent to your email."
    });
});

// @desc    Verify Email
// @route   POST /api/auth/verify-email
// @access  Private
export const verifyEmail = asyncHandler(async (req, res) => {
    const { verificationCode } = req.body;

    await verifyEmailService(verificationCode);

    res.status(200).json({
        success: true,
        message: "Email verified successfully. You can now log in.",
    });
});

// @desc    Login
// @route   POST /api/auth/login
// @access  Public
export const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await loginService(email, password);

    const token = generateToken(user._id, res);

    res.status(200).json({
        success: true,
        message: "Logged in successfully.",
        data: sanitizeUser(user),
        token,
    });
});

// @desc    Deactivate logged user
// @route   DELETE /api/auth/logout
// @access  Private
export const logout = asyncHandler(async (req, res) => {
    await logoutService(req.user._id);

    res.status(200).json({
        success: true,
        message: "logged out successfully.",
    });
});

// @desc    Forget Password
// @route   POST/ api/auth/forget-password
// @access  Public
export const forgetPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;

    await forgetPasswordService(email);

    res.status(200).json({
        success: true,
        message: "Password reset code sent to your email."
    });
});

// @desc    Reset Password
// @route   POST/ api/auth/reset-password
// @access  Private
export const resetPassword = asyncHandler(async (req, res) => {
    const { resetCode, password } = req.body;

    await resetPasswordService(resetCode, password);

    res.status(200).json({
        success: true,
        message: "Your password has been reset successfully. You can now log in with your new password.",
    });
});

// @desc    Get Logged user data
// @route   GET /api/auth/getMe
// @access  Private
export const getMe = asyncHandler(async (req, res) => {
    if (!req.user) {
        throw new ApiError('User not found.', 401);
    }

    res.status(200).json({
        success: true,
        data: sanitizeUser(req.user)
    });
});

// @desc    Update user data (without password, role)
// @route   PUT /api/auth/updateMe
// @access  Private
export const updateMe = asyncHandler(async (req, res) => {
    const { user, updatedEmail, updatedSecondaryEmail } = await updateMeService(
        req.user._id,
        req.body
    );

    let message = 'Profile updated successfully.';

    if (updatedEmail && updatedSecondaryEmail) {
        message = 'Profile updated. Verification sent to new email and secondary email.';
    } else if (updatedEmail) {
        message = 'Profile updated. Verification sent to new email.';
    } else if (updatedSecondaryEmail) {
        message = 'Profile updated. Verification sent to secondary email.';
    }

    res.status(200).json({
        success: true,
        message,
        data: sanitizeUser(user)
    });
});

// @desc    Change user password
// @route   PUT /api/auth/users
// @access  Private
export const changePassword = asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    await changePasswordService(req.user, currentPassword, newPassword);

    res.status(200).json({
        success: true,
        message: 'Your password has been updated successfully.'
    });
});
