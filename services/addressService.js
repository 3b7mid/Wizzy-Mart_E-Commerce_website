import asyncHandler from "express-async-handler";
import User from '../models/userModel.js';

// @desc    Add Address to user addresses list
// @route   POST /api/addresses
// @access  Protected/User
export const addAddress = asyncHandler(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(
        req.user._id,

        { $addToSet: { addresses: req.body } },

        { new: true },
    );

    res.status(200).json({
        status: 'Sucess',
        message: 'Address added successfully.',
        data: user.addresses
    });
});

// @desc    remove Address from user addresses list
// @route   DELETE /api/addresses/:addressId
// @access  Protected/User
export const removeAddress = asyncHandler(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(
        req.user._id,

        { $pull: { addresses: { _id: req.params.addressId } } },

        { new: true },
    );

    res.status(200).json({
        status: 'Sucess',
        message: 'Address removed successfully.',
        data: user.addresses,
    });
});

// @desc    Get logged user addresses
// @route   GET /api/addresses
// @access  Protected/User
export const getLoggedUserAddresses = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user._id).populate('addresses');

    res.status(200).json({
        status: 'success',
        results: user.addresses.length,
        data: user.addresses
    });
});