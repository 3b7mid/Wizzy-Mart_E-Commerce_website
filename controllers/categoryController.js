import asyncHandler from 'express-async-handler';
import { sanitizeCategory } from '../utils/sanitizeData.js';
import { createCategoryService, deleteCategoryService, getCategoriesService, getCategoryService, updateCategoryService } from '../services/categoryService.js';

// @desc    Create a category 
// @route   POST /api/categories
// @access  Private/Admin
export const createCategory = asyncHandler(async (req, res) => {
    const category = await createCategoryService(req.body);

    res.status(201).json({
        success: true,
        message: 'Category created successfully.',
        data: sanitizeCategory(category)
    });
});

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
export const getCategories = asyncHandler(async (req, res) => {
    const { totalCategories, pagination, categories } = await getCategoriesService(req.query);

    res.status(200).json({
        success: true,
        result: totalCategories,
        pagination,
        data: categories.map(sanitizeCategory)
    });
});

// @desc    Get a category
// @route   GET @access  Public
// route    /api/categories/:categoryId
export const getCategory = asyncHandler(async (req, res) => {
    const { categoryId } = req.params;

    const category = await getCategoryService(categoryId);

    res.status(200).json({
        success: true,
        data: sanitizeCategory(category)
    });
});

// @desc    Update a category
// @route   PUT /api/categories/:categoryId
// @access  Private/Admin
export const updateCategory = asyncHandler(async (req, res, next) => {
    const { categoryId } = req.params;
    const category = await updateCategoryService(categoryId, req.body);

    res.status(200).json({
        success: true,
        message: 'Category updated successfully.',
        data: sanitizeCategory(category)
    });
});

// @desc    Delete a category
// @route   PUT /api/categories/:categoryId
// @access  Private/Admin
export const deleteCategory = asyncHandler(async (req, res) => {
    const { categoryId } = req.params;

    await deleteCategoryService(categoryId);

    res.status(200).json({
        success: true,
        message: 'Category deleted successfully.'
    });
})