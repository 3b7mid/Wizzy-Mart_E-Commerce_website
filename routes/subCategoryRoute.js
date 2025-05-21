import express from 'express';
import { protect, allowedTo } from '../middlewares/authMiddleware.js';
import { createSubCategoryValidator, SubCategoryIDValidator, updateSubCategoryValidator } from '../validators/subCategoryValidator.js';
import { createSubCategory, getSubCategories, getSubCategory, updateSubCategory, deleteSubCategory } from '../controllers/subCategoryController.js';

const router = express.Router();

router.route('/')
    .get(getSubCategories)
    .post(protect, allowedTo('admin'), createSubCategoryValidator, createSubCategory);

router.route('/:subcategoryId')
    .get(SubCategoryIDValidator, getSubCategory)
    .put(protect, allowedTo('admin'), updateSubCategoryValidator, updateSubCategory)
    .delete(protect, allowedTo('admin'), SubCategoryIDValidator, deleteSubCategory)    

export default router;