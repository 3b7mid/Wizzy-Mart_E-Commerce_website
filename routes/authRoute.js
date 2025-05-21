import express from "express";
import { signupValidator, resendVerificationCodeValidator, verifyEmailValidator, loginValidator, forgetPasswordValidator, resetPasswordValidator, updateUserValidator, changeUserPasswordValidator } from '../validators/authValidator.js';
import { uploadSingleImage } from '../middlewares/multerMiddleware.js';
import { resizeUserImage } from '../middlewares/cloudinaryMiddleware.js';
import { protect } from '../middlewares/authMiddleware.js';
import { signup, verifyEmail, resendVerificationCode, login, logout, forgetPassword, resetPassword, getMe, updateMe, changePassword } from '../controllers/authController.js';

const router = express.Router();

router
    .route('/signup')
    .post(uploadSingleImage('profileImage'), resizeUserImage, signupValidator, signup);

router
    .route('/verify-email')
    .post(verifyEmailValidator, verifyEmail)

router
    .route('/resend-verificationCode')
    .post(resendVerificationCodeValidator, resendVerificationCode);

router
    .route('/login')
    .post(loginValidator, login);

router
    .route('/logout')
    .post(protect, logout);

router
    .route('/forget-password')
    .post(forgetPasswordValidator, forgetPassword); 

router
    .route('/reset-password')
    .put(resetPasswordValidator, resetPassword);

router
    .route('/getMe')
    .get(protect, getMe);

router
    .route('/updateMe')
    .put(protect, uploadSingleImage('profileImage'), resizeUserImage, updateUserValidator, updateMe);

router
    .route('/change-password')
    .put(protect, changeUserPasswordValidator, changePassword);

export default router;