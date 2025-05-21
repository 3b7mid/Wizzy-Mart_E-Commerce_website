import 'dotenv/config';
import asyncHandler from 'express-async-handler';
import transporter from '../../config/nodemailerConfig.js';
import { EMAIL_VERIFICATION_TEMPLATE, PASSWORD_RESET_REQUEST_TEMPLATE } from './emailTemplates.js';

export const sendVerificationEmail = asyncHandler(async (to, username, verificationCode) => {
    const html = EMAIL_VERIFICATION_TEMPLATE
        .replace('{username}', username)
        .replace('{verificationCode}', verificationCode);

    const mailOptions = {
        from: `Wizzy Mart <${process.env.USER_EMAIL}>`,
        to: to,
        subject: 'Email Verification Code (Valid for 1 hour)',
        html,
        category: 'Email Verification'
    };

    transporter.sendMail(mailOptions);
});

export const sendPasswordResetEmail = asyncHandler(async (to, username, resetCode) => {
    const html = PASSWORD_RESET_REQUEST_TEMPLATE
        .replace('{username}', username)
        .replace('{resetCode}', resetCode);

    const mailOptions = {
        from: `Wizzy Mart <${process.env.USER_EMAIL}>`,
        to: to,
        subject: 'Password Reset Code (Valid for 10 min)',
        html,
        category: 'Password Reset'
    }

    transporter.sendMail(mailOptions);
});