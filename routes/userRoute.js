import express from 'express';
import { getUsers, getUser, updateUser, deleteUser, changePassword, getLoggedUserData, updateLoggedUserData } from '../services/userService.js';
import { getUserValidator, updateUserValidator, deleteUserValidator, changeUserPasswordValidator } from '../middlewares/userMiddleware.js';
// import { resizeUserImage} from '../middlewares/cloudinaryMiddleware.js';
// import { uploadSingleImage } from '../utils/multer.js';
import { protect, allowedTo } from '../services/authService.js';

const router = express.Router();

router.get('/getMe', protect, getLoggedUserData, getUser);

router.put('/updateMe', protect, updateLoggedUserData);

//router.put('/changeMyPassword', protect, updateUserValidator, updateLoggedUserData);

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
