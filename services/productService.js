import asyncHandler from 'express-async-handler';
import ApiError from '../utils/apiError.js';
import ApiFeatures from '../utils/apiFeatures.js';
import { sanitizeProduct } from '../utils/sanitizeData.js';
import Product from '../models/productModel.js';

// @desc    Create a prodcut
// @route   POST /api/products
// @access  Private
export const createProduct = asyncHandler(async (req, res) => {
    const product = await Product.create(req.body);

    res.status(201).json({
        data: sanitizeProduct(product)
    });
});

// @desc    Get all Products
// @route   GET /api/products
// @access  Public
export const getProducts = asyncHandler(async (req, res) => {
    const totalproducts = await Product.countDocuments();

    const features = new ApiFeatures(Product.find(), req.query)
        .filter()
        .sort()
        .limitFields()
        .search(['title', 'description'])
        .paginate(totalproducts)

    const products = await features.mongooseQuery.exec();

    res.status(200).json({
        success: true,
        pagination: features.paginationResult,
        data: products.map(sanitizeProduct)
    });
});

// @desc    Get a product
// @route   GET /api/products/:id
// @access  Public
export const getProduct = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    let query = Product.findById(id);
    const product = await query;
    if (!product) {
        return next(new ApiError(`No product found with the ID ${id}.`, 404));
    }
    res.status(200).json({
        data: sanitizeProduct(product)
    });
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private
export const updateProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!product) {
        return next(new ApiError(`No product found with this ID ${id}`, 404));
    }

    product.save();

    res.status(200).json({
        data: sanitizeProduct(product)
    });
});

// @desc    Delete a product
// @route   PUT /api/products/:id
// @access  Private
export const deleteProduct = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const product = await Product.findOneAndDelete({ _id: id });
    if (!product) {
        return next(new ApiError(`No prodcut found with ID: ${id}`, 404));
    }

    res.status(204).end();
});