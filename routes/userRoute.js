import express from 'express';
import { protect, allowedTo } from '../services/authService.js';
import { getUserValidator, deleteUserValidator, changeUserPasswordValidator } from '../validators/userValidator.js';
import { getUsers, getUser, deleteUser, changePassword, getLoggedUserData, updateLoggedUserData } from '../services/userService.js';

const router = express.Router();

router.get('/getMe', protect, getLoggedUserData, getUser);

router.put('/updateMe', protect, updateLoggedUserData);

router.put('/change-password/:userId', protect, changeUserPasswordValidator, changePassword);

router
    .route('/')
    .get(protect, allowedTo('admin'), getUsers);

router
    .route('/:id')
    .get(protect, allowedTo('admin'), getUserValidator, getUser)
    .delete(protect, allowedTo('admin'), deleteUserValidator, deleteUser);

export default router;
