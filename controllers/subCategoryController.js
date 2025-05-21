import asyncHandler from 'express-async-handler';
import { sanitizeSubCategory } from '../utils/sanitizeData.js';
import { createSubCategoryService, getSubCategoriesService, getSubCategoryService, updateSubCategoryService, deleteSubCategoryService } from '../services/subCategoryService.js';

// @desc    Create a subCategory 
// @route   POST /api/subcategories
// @access  Private/Admin
export const createSubCategory = asyncHandler(async (req, res) => {
    const subcategory = await createSubCategoryService(req.body);

    res.status(201).json({
        success: true,
        message: 'subCategory created successfully.',
        data: sanitizeSubCategory(subcategory)
    });
});

// @desc    Get all subcategories
// @route   GET /api/subcategories
// @access  Public
export const getSubCategories = asyncHandler(async (req, res) => {
    const { totalSubCategories, pagination, subCategories } = await getSubCategoriesService(req.query);

    res.status(200).json({
        success: true,
        result: totalSubCategories,
        pagination,
        data: subCategories.map(sanitizeSubCategory)
    });
});

// @desc    Get a subCategory
// @route   GET @access  Public
// route    /api/subcategories/:subcategoryId
export const getSubCategory = asyncHandler(async (req, res) => {
    const { subcategoryId } = req.params;

    const subcategory = await getSubCategoryService(subcategoryId);

    res.status(200).json({
        success: true,
        data: sanitizeSubCategory(subcategory)
    });
});

// @desc    Update a subCategory
// @route   PUT /api/subcategories/:subcategoryId
// @access  Private/Admin
export const updateSubCategory = asyncHandler(async (req, res) => {
    const { subcategoryId } = req.params;

    const subCategory = await updateSubCategoryService(subcategoryId, req.body);

    res.status(200).json({
        success: true,
        message: 'subCategory updated successfully.',
        data: sanitizeSubCategory(subCategory)
    });
});

// @desc    Delete a subCategory
// @route   PUT /api/subcategories/:subcategoryId
// @access  Private/Admin
export const deleteSubCategory = asyncHandler(async (req, res) => {
    const { subcategoryId } = req.params;

    await deleteSubCategoryService(subcategoryId);

    res.status(200).json({
        success: true,
        message: 'subCategory deleted successfully.',
    });
});