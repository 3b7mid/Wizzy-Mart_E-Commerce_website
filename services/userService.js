import ApiFeatures from '../utils/apiFeatures.js';
import ApiError from '../utils/apiError.js';
import User from '../models/userModel.js';

export const createUserService = async ({ name, email, password, role }) => {
    const existingUser = await User.findOne({ $or: [{ email }, { secondaryEmail: email }] });

    if (existingUser) {
        throw new ApiError('Email already in use as primary or secondary email.', 400)
    }

    const user = await User.create({
        userName: name,
        email,
        password,
        role,
        isVerified: true
    });

    return user;
};

export const getUsersService = async (query) => {
    const totalUsers = await User.countDocuments({ role: { $ne: 'admin' } });

    const features = new ApiFeatures(User.find({ role: { $ne: 'admin' } }), query)
        .filter()
        .sort()
        .limitFields()
        .search(['name', 'email'])
        .paginate(totalUsers);

    const users = await features.mongooseQuery.exec();

    return {
        totalUsers,
        pagination: features.paginationResult,
        users
    };
};

export const getUserService = async (userId) => {
    const user = await User.findById(userId);

    if (!user) {
        throw new ApiError('User not found', 404);
    }

    return user;
};

export const updateUserService = async (userId, role) => {
    const user = await User.findByIdAndUpdate(userId, { role }, { new: true, runValidators: true });

    if (!user) {
        throw new ApiError('User not found', 404);
    }

    return user;
};

export const deleteUserService = async (userId) => {
    const user = await User.findByIdAndDelete(userId);

    if (!user) {
        throw new ApiError('User not found', 404);
    }

    return true;
};