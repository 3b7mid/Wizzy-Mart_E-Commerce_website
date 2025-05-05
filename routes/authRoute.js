import express from "express";
import { signupValidator, loginValidator } from '../validators/authValidator.js';
import { signup, verifyEmail, login, logout, forgetPassword, verifyResetToken, resetPassword, googleLogin, googleOAuthCallback, protect, allowedTo } from '../services/authService.js';

const router = express.Router();

router.route('/google')
    .post(googleLogin);

router.route('/google/callback')
    .get(googleOAuthCallback)

router.route('/signup')
    .post(signupValidator, signup);

router.route('/verify-email')
    .post(verifyEmail)        

router.route('/login')
    .post(loginValidator, login);

router.route('/logout')
    .post(protect, allowedTo('user'), logout);

router.route('/forget-password')
    .post(protect, allowedTo('user'), forgetPassword);

router.route('/verify-resetCode')
    .post(verifyResetToken);

router.route('/reset-password')
    .put(resetPassword);

export default router;