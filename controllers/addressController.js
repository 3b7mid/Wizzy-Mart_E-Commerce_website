import asyncHandler from "express-async-handler";
import { addAddressService, getAddressesService, getAddressService, updateAddressService, removeAddressService } from "../services/addressService.js";

// @desc    Add Address to user addresses list
// @route   POST /api/addresses
// @access  Private/User
export const addAddress = asyncHandler(async (req, res) => {
    const user = await addAddressService(req.user._id, req.body);

    res.status(200).json({
        success: true,
        message: 'Address added successfully.',
        data: user.addresses
    });
});

// @desc    Get logged user addresses
// @route   GET /api/addresses
// @access  Private/User
export const getAddresses = asyncHandler(async (req, res) => {
    const user = await getAddressesService(req.user._id);

    res.status(200).json({
        success: true,
        results: user.addresses.length,
        data: user.addresses
    });
});

// @desc    Get user address
// @route   GET /api/addresses/:addressId
// @access  Private/User
export const getAddress = asyncHandler(async (req, res) => {
    const { addressId } = req.params;

    const address = await getAddressService(req.user._id, addressId);

    res.status(200).json({
        success: true,
        data: address
    })
});

// @desc    Update user address
// @route   PUT /api/addresses/:addressId
// @access  Private/User
export const updateAddress = asyncHandler(async (req, res) => {
    const { addressId } = req.params;

    const user = await updateAddressService(req.user._id, addressId, req.body);

    res.status(200).json({
        success: true,
        message: 'Address updated successfully.',
        data: user.addresses
    });
});

// @desc    remove Address from user addresses list
// @route   DELETE /api/addresses/:addressId
// @access  Private/User
export const removeAddress = asyncHandler(async (req, res) => {
    const { addressId } = req.params;

    const user = await removeAddressService(req.user._id, addressId)

    res.status(200).json({
        success: true,
        message: 'Address removed successfully.',
        data: user.addresses
    });
});