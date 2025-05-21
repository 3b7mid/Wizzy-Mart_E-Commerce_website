import jwt from "jsonwebtoken";
import crypto from 'crypto';
import "dotenv/config";

export const generateToken = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  res.cookie("jwt", token, {
    maxAge: Number(process.env.JWT_COOKIE_EXPIRES_IN) * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV !== "development",
    path: "/",
  });

  res.setHeader("Authorization", `Bearer ${token}`);

  return token;
};

export const generateVerificationCode = () => {
  const code = crypto.randomInt(100000, 999999).toString();
  const hashed = crypto.createHash('sha256').update(code).digest('hex');
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

  return { code, hashed, expiresAt };
}

export const generateResetPasswordCode = () => {
  const code = crypto.randomInt(100000, 999999).toString();
  const hashed = crypto.createHash('sha256').update(code).digest('hex');
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  return { code, hashed, expiresAt };
};

export const hashedCode = (code) => crypto.createHash("sha256").update(code).digest("hex");
