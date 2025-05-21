import { generateVerificationCode, generateResetPasswordCode, hashedCode } from "../utils/tokens.js";
import { comparedPasswordInLogin, comparedPasswordInChangePassword } from "../utils/password.js";
import ApiError from "../utils/apiError.js";
import { sendVerificationEmail, sendPasswordResetEmail } from "../utils/sendEmails/emails.js";
import User from "../models/userModel.js";

export const signupService = async ({ name, email, password, profileImage }) => {
  const existingUser = await User.findOne({ $or: [{ email }, { secondaryEmail: email }] });

  if (existingUser) {
    throw new ApiError('Email already in use as primary or secondary email.', 400)
  }

  const { code, hashed, expiresAt } = generateVerificationCode();

  const user = await User.create({
    userName: name,
    email,
    password,
    profileImage,
    isVerified: false,
    verificationCode: hashed,
    verificationCodeExpiresAt: expiresAt,
  });

  try {
    await sendVerificationEmail(user.email, user.userName, code);
  } catch (error) {
    user.verificationCode = undefined;
    user.verificationCodeExpiresAt = undefined;
    await user.save();
    throw new ApiError("Failed to send verification code email. Please try again.", 500);
  }

  return user;
};

export const resendVerificationCodeService = async (email) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError('User not found', 404);
  }

  if (user.isVerified) {
    throw new ApiError("User already verified.", 400);
  }

  const { code, hashed, expiresAt } = generateVerificationCode();

  user.verificationCode = hashed;
  user.verificationCodeExpiresAt = expiresAt;
  user.lastVerificationCodeSentAt = new Date();
  await user.save();

  try {
    await sendVerificationEmail(user.email, user.userName, code);
  } catch (error) {
    user.verificationCode = undefined;
    user.verificationCodeExpiresAt = undefined;
    await user.save();
    throw new ApiError("Failed to send verification code. Please try again later.", 500)
  }

  return true;
};

export const verifyEmailService = async (verificationCode) => {
  const hashedVerificationCode = hashedCode(verificationCode);

  const user = await User.findOne({
    verificationCode: hashedVerificationCode,
    verificationCodeExpiresAt: { $gt: Date.now() }
  });

  if (!user) {
    throw new ApiError("Invalid or expired verification code.", 400);
  }

  user.isVerified = true;
  user.verificationCode = undefined;
  user.verificationCodeExpiresAt = undefined;
  await user.save();

  return true;
};

export const loginService = async (email, password) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError("Incorrect email or password.", 401);
  }

  if (!user.isVerified) {
    throw new ApiError("Please verify your email before logging in.", 400);
  }

  await comparedPasswordInLogin(password, user.password);

  user.active = true;
  await user.save();

  return user
};

export const logoutService = async (userId) => {
  await User.findByIdAndUpdate(userId, { active: false });

  return true;
};

export const forgetPasswordService = async (email) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError('User not found', 404);
  }

  const { code, hashed, expiresAt } = generateResetPasswordCode();

  user.passwordResetCode = hashed;
  user.passwordResetExpiresAt = expiresAt;
  user.passwordResetVerified = false;
  await user.save();

  try {
    await sendPasswordResetEmail(user.email, user.userName, code);
  } catch (error) {
    user.passwordResetCode = undefined;
    user.passwordResetExpiresAt = undefined;
    user.passwordResetVerified = undefined;
    await user.save();
    throw new ApiError("Failed to send password reset email. Please try again.", 500);
  }

  return true;
};

export const resetPasswordService = async (resetCode, password) => {
  const hashedResetCode = hashedCode(resetCode);

  const user = await User.findOne({
    passwordResetCode: hashedResetCode,
    passwordResetExpiresAt: { $gt: Date.now() }
  });

  if (!user) {
    throw new ApiError('Invalid or expired reset code. Please try again.', 400);
  }

  user.password = password;
  user.passwordResetVerified = true;
  user.passwordResetCode = undefined;
  user.passwordResetExpiresAt = undefined;
  user.passwordChangedAt = new Date();
  await user.save();

  return true;
};

const allowedFields = [
  'displayName', 'userName', 'fullName', 'email', 'secondaryEmail',
  'phoneNumber', 'country', 'states', 'zipCode', 'profileImage'
];

const filterAllowedFields = (obj, allowedFields) => {
  const filtered = {};
  Object.keys(obj).forEach(key => {
    if (allowedFields.includes(key)) {
      filtered[key] = obj[key];
    }
  });
  return filtered;
};

export const updateMeService = async (userId, updateData) => {
  const filteredData = filterAllowedFields(updateData, allowedFields);
  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError('User not found', 404);
  }

  let updatedEmail = false;
  let updatedSecondaryEmail = false;

  if (filteredData.email && filteredData.email !== user.email) {
    const email = filteredData.email;
    const existingUser = await User.findOne({ $or: [{ email }, { secondaryEmail: email }] });

    if (existingUser) {
      throw new ApiError('Email already in use as primary or secondary email.', 400)
    }

    updatedEmail = true;
    user.isVerified = false;

    const { code, hashed, expiresAt } = generateVerificationCode();
    user.verificationCode = hashed;
    user.verificationCodeExpiresAt = expiresAt;

    try {
      await sendVerificationEmail(filteredData.email, user.userName, code);
    } catch (error) {
      user.verificationCode = undefined;
      user.verificationCodeExpiresAt = undefined;
      await user.save();
      throw new ApiError('Failed to send email verification code. Please try again.', 500);
    }
  }

  if (filteredData.secondaryEmail && filteredData.secondaryEmail !== user.secondaryEmail) {
    const secondaryEmail = filteredData.secondaryEmail;
    const existingUser = await User.findOne({ $or: [{ email: secondaryEmail }, { secondaryEmail }] });

    if (existingUser) {
      throw new ApiError('Email already in use as primary or secondary email.', 400)
    }

    updatedSecondaryEmail = true;
    const { code, hashed, expiresAt } = generateVerificationCode();
    user.verificationCode = hashed;
    user.verificationCodeExpiresAt = expiresAt;

    try {
      await sendVerificationEmail(filteredData.secondaryEmail, user.userName, code);
    } catch (error) {
      user.verificationCode = undefined;
      user.verificationCodeExpiresAt = undefined;
      await user.save();
      throw new ApiError('Failed to send secondary email verification code. Please try again.', 500);
    }
  }

  Object.assign(user, filteredData);
  const updatedUser = await user.save();

  return {
    user: updatedUser,
    updatedEmail,
    updatedSecondaryEmail
  };
};

export const changePasswordService = async (user, currentPassword, newPassword) => {
  await comparedPasswordInChangePassword(currentPassword, user.password);

  const isSamePassword = await comparedPasswordInChangePassword(newPassword, user.password).catch(() => false);

  if (isSamePassword) {
    throw new ApiError('New password must be different from the current password.', 400);
  }

  user.password = newPassword;
  user.passwordChangedAt = new Date();
  await user.save();

  return true;
};