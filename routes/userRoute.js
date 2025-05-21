import express from 'express';
import { protect, allowedTo } from '../middlewares/authMiddleware.js';
import { createUserValidator, updateUserRoleValidator, UserIdValidator } from '../validators/userValidator.js';
import { createUser, getUsers, getUser, deleteUser, updateUser } from '../controllers/userController.js';

const router = express.Router();

router
    .route('/')
    .post(protect, allowedTo('admin'), createUserValidator, createUser)
    .get(protect, allowedTo('admin'), getUsers);

router
    .route('/:userId')
    .get(protect, allowedTo('admin'), UserIdValidator, getUser)
    .put(protect, allowedTo('admin'), updateUserRoleValidator, updateUser)
    .delete(protect, allowedTo('admin'), UserIdValidator, deleteUser);

export default router;
