import 'dotenv/config';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
        secure: true,
        host: 'smtp.gmail.com',
        port: 465,
        auth: {
            user: process.env.USER_EMAIL,
            pass: process.env.USER_PASS
        }
});

export default transporter;