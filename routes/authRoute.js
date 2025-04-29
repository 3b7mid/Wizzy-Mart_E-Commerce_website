import express from "express";
import { signupValidator, loginValidator } from '../validators/authValidator.js';
import { resizeUserImage } from "../middleware/cloudinaryMiddleware.js";
import { uploadSingleImage } from "../middleware/multerMiddleware.js";
import { signup, verifyEmail, login, logout, forgetPassword, verifyResetToken, resetPassword } from '../services/authService.js';

const router = express.Router();

router.route('/signup')
    .post(uploadSingleImage('profileImage'), resizeUserImage, signupValidator, signup);

router.route('/verify-email')
    .post(verifyEmail)        

router.route('/login')
    .post(loginValidator, login);

router.route('/logout', logout);

router.route('/forget-password')
    .post(forgetPassword);

router.route('/verify-resetCode')
    .post(verifyResetToken);

router.route('/reset-password')
    .put(resetPassword);

export default router;