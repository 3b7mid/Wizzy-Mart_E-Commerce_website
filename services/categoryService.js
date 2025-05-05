import asycnHandler from 'express-async-handler';
import ApiFeature from '../utils/apiFeatures.js';
import ApiError from '../utils/apiError.js';
import { sanitizeCategory } from '../utils/sanitizeData.js';
import Category from '../models/categoryModel.js';

// @desc    Create a category 
// @route   POST /api/categories
// @access  Private/Admin
export const createCategory = asycnHandler(async (req, res) => {
    const category = await Category.create(req.body);

    res.status(201).json({
        success: true,
        data: sanitizeCategory(category)
    });
});

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
export const getCategories = asycnHandler(async (req, res) => {
    const totalCategories = await Category.countDocuments();

    const features = new ApiFeature(Category.find(), req.query)
        .filter()
        .sort()
        .limitFields()
        .search(['name'])
        .paginate(totalCategories)

    const categories = await features.mongooseQuery.exec();

    res.status(200).json({
        success: true,
        pagination: features.paginationResult,
        data: categories.map(sanitizeCategory)
    });
});

// @desc    Get a category
// @route   GET @access  Public
// route    /api/categories/:id
export const getCategory = asycnHandler(async (req, res) => {
    const { id } = req.params;

    const category = await Category.findById(id);
    if (!category) {
        return next(new ApiError(`No category found with id: ${id}`, 404));
    }

    res.status(200).json({
        success: true,
        data: sanitizeCategory(category)
    });
});

// @desc    Update a category
// @route   PUT /api/categories/:id
// @access  Private/Admin
export const updateCategory = asycnHandler(async (req, res, next) => {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

    if (!category) {
        return next(new ApiError(`No category found with this ID ${req.params.id}`, 404));
    }

    res.status(200).json({ data: sanitizeCategory(category) });
});

// @desc    Delete a category
// @route   PUT /api/categories/:id
// @access  Private/Admin
export const deleteCategory = asycnHandler(async (req, res, next) => {
    const category = await Category.findByIdAndDelete(req.params.id);

    if (!category) {
        return next(new ApiError(`No category found with this ID ${req.params.id}`, 404));
    }
    res.status(200).end();
});