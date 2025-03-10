import asycnHandler from 'express-async-handler';
import ApiFeature from '../utils/apiFeatures.js';
import ApiError from '../utils/apiError.js';
import { sanitizeSubCategory } from '../utils/sanitizeData.js';
import SubCategory from '../models/subCategoryModel.js';

// @desc    Create a subCategory 
// @route   POST /api/subcategories
// @access  Private/Admin
export const createSubCategory = asycnHandler(async (req, res) => {
    const subcategory = await SubCategory.create(req.body);

    res.status(201).json({
        success: true,
        data: sanitizeSubCategory(subcategory)
    });
});

// @desc    Get all subcategories
// @route   GET /api/subcategories
// @access  Public
export const getSubCategories = asycnHandler(async (req, res) => {
    const totalSubCategories = await SubCategory.countDocuments();

    const features = new ApiFeature(SubCategory.find(), req.query)
        .filter()
        .sort()
        .limitFields()
        .search(['name'])
        .paginate(totalSubCategories)

    const subCategories = await features.mongooseQuery.exec();

    res.status(200).json({
        success: true,
        pagination: features.paginationResult,
        data: subCategories.map(sanitizeSubCategory)
    });
});

// @desc    Get a subCategory
// @route   GET @access  Public
// route    /api/subcategories/:id
export const getSubCategory = asycnHandler(async (req, res, next) => {
    const { id } = req.params;

    const subcategory = await SubCategory.findById(id);
    
    if (!subcategory) {
        return next(new ApiError(`No subcategory found with id: ${id}`, 404));
    }

    res.status(200).json({
        success: true,
        data: sanitizeSubCategory(subcategory)
    });
});

// @desc    Update a subCategory
// @route   PUT /api/subcategories/:id
// @access  Private/Admin
export const updateSubCategory = asycnHandler(async (req, res, next) => {
    const subCategory = await SubCategory.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

    if (!subCategory) {
        return next(new ApiError(`No subCategory found with this ID ${req.params.id}`, 404));
    }

    res.status(200).json({ data: sanitizeSubCategory(subCategory) });
});

// @desc    Delete a subCategory
// @route   PUT /api/subcategories/:id
// @access  Private/Admin
export const deleteSubCategory = asycnHandler(async (req, res, next) => {
    const { id } = req.params;
    const subCategory = await SubCategory.findByIdAndDelete(id);

    if (!subCategory) {
        return next(new ApiError(`No subCategory found with this ID ${req.params.id}`, 404));
    }
    res.status(200).end();
});