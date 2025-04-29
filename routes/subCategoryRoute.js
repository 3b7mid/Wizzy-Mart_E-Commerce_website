import express from 'express';
import { protect, allowedTo } from '../services/authService.js';
import { createSubCategoryValidator, getSubCategoryValidator, updateSubCategoryValidator, deleteSubCategoryValidator } from '../validators/subCategoryValidator.js';
import { createSubCategory, getSubCategories, getSubCategory, updateSubCategory, deleteSubCategory } from '../services/subCategoryService.js';

const router = express.Router();

router.route('/')
    .get(getSubCategories)
    .post(protect, allowedTo('admin'), createSubCategoryValidator, createSubCategory);

router.route('/:id')
    .get(getSubCategoryValidator, getSubCategory)
    .put(protect, allowedTo('admin'), updateSubCategoryValidator, updateSubCategory)
    .delete(protect, allowedTo('admin'), deleteSubCategoryValidator, deleteSubCategory)    

export default router;