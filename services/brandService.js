import asycnHandler from 'express-async-handler';
import ApiFeature from '../utils/apiFeatures.js';
import ApiError from '../utils/apiError.js';
import { sanitizeBrand } from '../utils/sanitizeData.js';
import Brand from '../models/brandModel.js';

// @desc    Create a subCategory 
// @route   POST /api/brands
// @access  Private/Admin
export const createBrand = asycnHandler(async (req, res) => {
    const brand = await Brand.create(req.body);

    res.status(201).json({
        success: true,
        data: sanitizeBrand(brand)
    });
});

// @desc    Get all brands
// @route   GET /api/brands
// @access  Public
export const getBrands = asycnHandler(async (req, res) => {
    const totalBrands = await Brand.countDocuments();

    const features = new ApiFeature(Brand.find(), req.query)
        .filter()
        .sort()
        .limitFields()
        .search(['name'])
        .paginate(totalBrands)

    const brands = await features.mongooseQuery.exec();

    res.status(200).json({
        success: true,
        pagination: features.paginationResult,
        data: brands.map(sanitizeBrand)
    });
});

// @desc    Get a brand
// @route   GET @access  Public
// route    /api/brands/:id
export const getBrand = asycnHandler(async (req, res, next) => {
    const { id } = req.params;

    const brand = await Brand.findById(id);

    if (!brand) {
        return next(new ApiError(`No brand found with id: ${id}`, 404));
    }

    res.status(200).json({
        success: true,
        data: sanitizeBrand(brand)
    });
});

// @desc    Update a brand
// @route   PUT /api/brands/:id
// @access  Private/Admin
export const updateBrand = asycnHandler(async (req, res, next) => {
    const { id } = req.params;
    const brand = await Brand.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });

    if (!brand) {
        return next(new ApiError(`No brand found with this ID ${id}`, 404));
    }

    res.status(200).json({ data: sanitizeBrand(brand) });
});

// @desc    Delete a brand
// @route   PUT /api/brands/:id
// @access  Private/Admin
export const deletebrand = asycnHandler(async (req, res, next) => {
    const { id } = req.params;
    const brand = await Brand.findByIdAndDelete(id);

    if (!brand) {
        return next(new ApiError(`No brand found with this ID ${req.params.id}`, 404));
    }
    res.status(200).end();
});