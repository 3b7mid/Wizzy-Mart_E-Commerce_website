import express from 'express';
import { protect, allowedTo } from '../services/authService.js';
import { getUserValidator, updateUserValidator, deleteUserValidator, changeUserPasswordValidator } from '../validators/userValidator.js';
import { getUsers, getUser, updateUser, deleteUser, changePassword, getLoggedUserData, updateLoggedUserData } from '../services/userService.js';

const router = express.Router();

router.get('/getMe', protect, getLoggedUserData, getUser);

router.put('/updateMe', protect, updateLoggedUserData);

router.put('/change-password/:id', protect, changeUserPasswordValidator, changePassword);

router
    .route('/')
    .get(protect, allowedTo('admin'), getUsers);

router
    .route('/:id')
    .get(protect, allowedTo('admin'), getUserValidator, getUser)
    .put(protect, allowedTo('admin'), updateUserValidator, updateUser)
    .delete(protect, allowedTo('admin'), deleteUserValidator, deleteUser);

export default router;
