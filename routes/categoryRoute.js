import express from "express";
import { protect, allowedTo } from '../middlewares/authMiddleware.js';
import { createCategoryValidator, CategoryIDValidator, updateCategoryValidator } from "../validators/categoryValidator.js";
import { uploadSingleImage } from '../middlewares/multerMiddleware.js';
import { resizeCategoryImage } from '../middlewares/cloudinaryMiddleware.js';
import { createCategory, getCategories, getCategory, updateCategory, deleteCategory } from "../controllers/categoryController.js";

const router = express.Router();

router.use(protect);

router.route('/')
    .get(getCategories)
    .post(allowedTo('admin'), uploadSingleImage('categoryImage'), resizeCategoryImage, createCategoryValidator, createCategory);

router.route('/:categoryId')
    .get(CategoryIDValidator, getCategory)
    .put(allowedTo('admin'), uploadSingleImage('categoryImage'), resizeCategoryImage, updateCategoryValidator, updateCategory)
    .delete(allowedTo('admin'), CategoryIDValidator, deleteCategory)

export default router;