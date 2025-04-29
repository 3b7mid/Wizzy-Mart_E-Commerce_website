import express from "express";
import { protect, allowedTo } from '../services/authService.js';
import { createCategoryValidator, getCategoryValidator, updateCategoryValidator, deleteCategoryValidator } from "../validators/categoryValidator.js";
import { uploadSingleImage } from '../middleware/multerMiddleware.js';
import { resizecategoryImage } from '../middleware/cloudinaryMiddleware.js';
import { createCategory, getCategories, getCategory, updateCategory, deleteCategory } from "../services/categoryService.js";

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