import 'dotenv/config';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
        secure: true,
        host: process.env.HOST,
        port: process.env.Email_PORT,
        auth: {
            user: process.env.USER_EMAIL,
            pass: process.env.USER_PASS
        }
});

export default transporter;