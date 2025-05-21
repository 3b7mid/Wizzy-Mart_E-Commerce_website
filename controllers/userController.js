import asyncHandler from 'express-async-handler';
import { sanitizeUser } from '../utils/sanitizeData.js';
import { createUserService, getUserService, deleteUserService, updateUserService, getUsersService } from '../services/userService.js';

// @desc    Create user
// @route   POST /api/admin/users
// @access  Private/Admin
export const createUser = asyncHandler(async (req, res) => {
    const user = await createUserService(req.body);

    res.status(201).json({
        success: true,
        message: 'User created successfully.',
        data: sanitizeUser(user)
    });
});

// @desc    Get all Users
// @route   GET /api/admin/users
// @access  Private/Admin
export const getUsers = asyncHandler(async (req, res) => {
    const { totalUsers, pagination, users } = await getUsersService(req.query);

    res.status(200).json({
        success: true,
        result: totalUsers,
        pagination,
        data: users.map(sanitizeUser)
    });
});

// @desc    Get a user
// @route   GET /api/admin/users/:userId
// @access  Private/Admin
export const getUser = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const user = await getUserService(userId);

    res.status(200).json({
        success: true,
        data: sanitizeUser(user)
    });
});

// @desc    Update a user
// @route   PUT /api/admin/users/:userId
// @access  Private/Admin
export const updateUser = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const { role } = req.body;
    const user = await updateUserService(userId, role);

    res.status(200).json({
        success: true,
        message: 'User updated successfully.',
        data: sanitizeUser(user)
    });
});

// @desc    Delete a user
// @route   Delete /api/admin/users/:userId
// @access  Private/Admin
export const deleteUser = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    await deleteUserService(userId);

    res.status(200).json({
        success: true,
        message: 'User deleted successfully.'
    });
});