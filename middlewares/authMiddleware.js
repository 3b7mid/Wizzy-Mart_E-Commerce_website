import 'dotenv/config';
import asyncHandler from "express-async-handler";
import ApiError from '../utils/apiError.js';
import jwt from "jsonwebtoken";
import User from '../models/userModel.js';

// @desc    Make sure the user is logged in
export const protect = asyncHandler(async (req, res, next) => {
    let token;
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith("Bearer")) {
        token = authHeader.split(" ")[1];
    }

    if (!token) {
        return next(new ApiError("Access denied. Please log in to continue.", 401));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const currentUser = await User.findById(decoded.userId).select('-password');
    if (!currentUser) {
        return next(
            new ApiError("No user associated with this token was found.", 404)
        );
    }

    if (!currentUser.active) {
        return next(
            new ApiError(
                "This account is currently inactive. Please log in again to continue.",
                401
            )
        );
    }

    req.user = currentUser;
    next();
});

// @desc    Optional authentication - allows both authenticated and guest chat with bot
export const optionalAuth = asyncHandler(async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer')) {
        req.user = null; 
        return next();
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const currentUser = await User.findById(decoded.userId).select('-password');
        
        if (currentUser && currentUser.active) {
            req.user = currentUser;
        } else {
            req.user = null; 
        }
    } catch (error) {
        req.user = null;
    }

    next();
});

// @desc    Restrict access to specific roles
export const allowedTo = (...roles) =>
    asyncHandler(async (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(
                new ApiError(
                    "Access denied. You do not have permission to perform this action.",
                    403
                )
            );
        }

        next();
    });