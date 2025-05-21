import bcrypt from "bcrypt";
import ApiError from "./apiError.js";

export const comparedPasswordInLogin = async (enteredPassword, hashedPassword) => {
    const isMatch = await bcrypt.compare(enteredPassword, hashedPassword);

    if (!isMatch) {
        throw new ApiError('Incorrect email or password.', 401);
    }

    return true;
};

export const comparedPasswordInChangePassword = async (enteredPassword, hashedPassword) => {
    const isMatch = await bcrypt.compare(enteredPassword, hashedPassword);

    if (!isMatch) {
        throw new ApiError('Incorrect current password.', 401);
    }

    return true;
};