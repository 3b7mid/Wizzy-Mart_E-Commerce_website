import ApiError from '../utils/apiError.js';
import User from '../models/userModel.js';

export const addAddressService = async (userId, addressData) => {
    const user = await User.findById(userId);
    
    if (!user) {
        throw new ApiError('User not found', 404);
    }

    const updatedUser = await User.findByIdAndUpdate(userId, { $addToSet: { addresses: addressData } }, { new: true, runValidators: true }).populate('addresses');

    return updatedUser;
};

export const getAddressesService = async (userId) => {
    const user = await User.findById(userId).populate('addresses');

    if (!user) {
        throw new ApiError('User not found', 404);
    }

    return user;
};

export const getAddressService = async (userId, addressId) => {
    const user = await User.findById(userId).populate('addresses');

    if (!user) {
        throw new ApiError('User not found', 404);
    }

    const address = user.addresses.find((address) => address._id.toString() === addressId);
    
    if (!address) {
        throw new ApiError('Address not found', 404);
    }

    return address;
};

export const updateAddressService = async (userId, addressId, addressData) => {
    const updateQuery = {};

    Object.keys(addressData).forEach(key => {
        updateQuery[`addresses.$.${key}`] = addressData[key];
    });

    const updatedUser = await User.findOneAndUpdate({ _id: userId, 'addresses._id': addressId }, { $set: updateQuery }, { new: true, runValidators: true });

    if (!updatedUser) {
        throw new ApiError('Address not found', 404);
    }

    return updatedUser;
};

export const removeAddressService = async (userId, addressId) => {
    const updatedUser = await User.findOneAndUpdate(
        { _id: userId, 'addresses._id': addressId },
        { $pull: { addresses: { _id: addressId } } },
        { new: true, runValidators: true }
    );

    if (!updatedUser) {
        throw new ApiError('Address not found.', 404);
    }

    return updatedUser;
};