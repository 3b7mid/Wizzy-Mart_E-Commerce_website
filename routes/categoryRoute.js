import express from "express";
import { createCategory, getCategories, getCategory, updateCategory, deleteCategory } from "../services/categoryService.js";
import { createCategoryValidator, getCategoryValidator, updateCategoryValidator, deleteCategoryValidator } from "../middlewares/categoryMiddleware.js";
import { protect, allowedTo } from '../services/authService.js';
import { uploadSingleImage } from '../utils/multer.js';
import { resizecategoryImage } from '../middlewares/cloudinaryMiddleware.js';

const router = express.Router();
router.use(protect);

router.route('/')
    .get(getCategories)
    .post(allowedTo('admin'), uploadSingleImage('categoryImage'), resizecategoryImage, createCategoryValidator, createCategory);

router.route('/:id')
    .get(getCategoryValidator, getCategory)
    .put(allowedTo('admin'), uploadSingleImage('categoryImage'), resizecategoryImage, updateCategoryValidator, updateCategory)
    .delete(allowedTo('admin'), deleteCategoryValidator, deleteCategory)

export default router;