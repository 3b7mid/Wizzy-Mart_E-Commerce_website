import ApiError from '../utils/apiError.js';
import User from '../models/userModel.js';
import Product from '../models/productModel.js';

export const addProductToWishlistService = async (userId, productId) => {
    const product = await Product.findById(productId);

    if (!product) {
        throw new ApiError(`Product not found.`, 404);
    }

    const user = await User.findById(userId);

    if (user.wishlist.includes(productId)) {
        throw new ApiError(`Product already exist in your wishlist.`, 400);
    }

    const updatedUser = await User.findByIdAndUpdate(userId, { $addToSet: { wishlist: productId } }, { new: true, runValidators: true }).populate('wishlist');
    
    return updatedUser;
};

export const getUserWishlistService = async (userId) => {
    const user = await User.findById(userId).populate('wishlist');
    
    return user;
};

export const removeProductFromWishlistService = async (userId, productId) => {
    const product = await Product.findById(productId);

    if (!product) {
        throw new ApiError(`Product not found.`, 404);
    }

    const user = await User.findById(userId);

    if (!user || !user.wishlist.includes(productId)) {
        throw new ApiError(`Product not found in your wishlist.`, 404);
    }

    const updatedUser = await User.findByIdAndUpdate(userId, { $pull: { wishlist: productId } }, { new: true, runValidators: true }).populate('wishlist');
    
    return updatedUser;
};