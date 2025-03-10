import jwt from 'jsonwebtoken';
import 'dotenv/config';

export const createToken = (userId, res) => {

    const token = jwt.sign({ userId }, process.env.JWT_SECRET_KEY, {
         expiresIn: process.env.JWT_EXPIRES_IN
    });

    res.cookie('jwt', token, {
        maxAge: (Number(process.env.JWT_COOKIE_EXPIRES_IN) || 7) * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV !== 'development'
    });

    return token;
}