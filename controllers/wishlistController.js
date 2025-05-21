import asyncHandler from "express-async-handler";
import { addProductToWishlistService, getUserWishlistService, removeProductFromWishlistService } from "../services/wishlistService.js";

// @desc    Add product to wishlist
// @route   POST /api/wishlist
// @access  Private/User
export const addProductToWishlist = asyncHandler(async (req, res) => {
    const { productId } = req.body;

    const user = await addProductToWishlistService(req.user._id, productId);

    res.status(200).json({
        success: true,
        message: 'Prodcut added successfully to wishlist.',
        data: user.wishlist,
    });
});

// @desc    Get logged user wishlist
// @route   GET /api/wishlist
// @access  Private/User
export const getUserWishlist = asyncHandler(async (req, res) => {
    const user = await getUserWishlistService(req.user._id);

    res.status(200).json({
        success: true,
        results: user.wishlist.length,
        data: user.wishlist
    });
});

// @desc    remove product from wishlist
// @route   DELETE /api/wishlist/:productId
// @access  Private/User
export const removeProductFromWishlist = asyncHandler(async (req, res) => {
    const { productId } = req.params;

    const user = await removeProductFromWishlistService(req.user._id, productId);

    res.status(200).json({
        success: true,
        message: 'Product removed successfully from wishlist.',
        data: user.wishlist,
    });
});