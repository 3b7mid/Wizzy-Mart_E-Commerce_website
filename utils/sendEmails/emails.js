import 'dotenv/config';
import asyncHandler from 'express-async-handler';
import transporter from './nodemailerConfig.js';
import { PASSWORD_RESET_REQUEST_TEMPLATE } from './emailTemplates.js';

// export const sendVerificationEmail = asyncHandler(async (isEmail, verificationToken) => {

// });

// export const sendWelcomeEmail = asyncHandler(async (email, name) => {

// });

export const sendPasswordResetEmail = asyncHandler(async (to, username, resetCode) => {
    const updatedHtml = PASSWORD_RESET_REQUEST_TEMPLATE
        .replace('{username}', username)
        .replace('{resetCode}', resetCode);

    const mailOptions = {
        from: `Azir E-commerce ${process.env.USER_EMAIL}`,
        to: to,
        subject: 'Password Reset Code (Valid for 10 min)',
        html: updatedHtml,
        category: 'Password Reset'
    }

    transporter.sendMail(mailOptions);
    // , (error, info) => {
    //     if (error) {
    //         console.error('Error sending email:', error);
    //     } else {
    //         console.log('Email sent successfully:', info.response);
    //     }
    // });
});
