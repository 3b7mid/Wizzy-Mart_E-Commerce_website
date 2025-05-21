import ApiFeatures from '../utils/apiFeatures.js';
import ApiError from '../utils/apiError.js';
import User from '../models/userModel.js';
import Product from '../models/productModel.js';

export const createProductService = async (userId, productInput) => {
    const {
        name,
        slug,
        description,
        sku,
        model,
        category,
        subCategory,
        brand,
        price,
        priceAfterDiscount,
        quantity,
        sold,
        availability,
        ratingsAverage,
        ratingsQuantity,
        imageCover,
        images,
        features,
        colors,
        memory,
        storage,
        tags,
        size,
        weight,
        shippingInfo,
    } = productInput;

    let discountPercent = 0;
    if (price && priceAfterDiscount && price > priceAfterDiscount) {
        discountPercent = Math.round(((price - priceAfterDiscount) / price) * 100);
    }

    const productData = {
        name,
        slug,
        description,
        seller: userId,
        sku,
        model,
        category,
        subCategory,
        brand,
        price,
        priceAfterDiscount,
        discountPercent,
        quantity,
        sold,
        availability,
        ratingsAverage,
        ratingsQuantity,
        imageCover,
        images,
        features,
        colors,
        memory,
        storage,
        tags,
        size,
        weight,
        shippingInfo,
    };

    const product = await Product.create(productData);

    return product;
};

export const getProductsService = async (req, isSellerRoute) => {
    const filter = isSellerRoute ? { seller: req.user._id } : {};

    const totalProducts = await Product.countDocuments(filter);

    const features = new ApiFeatures(Product.find(filter).populate('seller', '_id userName'), req.query)
        .filter()
        .sort()
        .limitFields()
        .search(['name', 'tags', 'description'])
        .paginate(totalProducts);

    const products = await features.mongooseQuery.exec();

    return {
        totalProducts,
        pagination: features.paginationResult,
        products
    };
};

export const getProductService = async (productId) => {
    const product = await Product.findById(productId).populate('seller', '_id userName');

    if (!product) {
        throw new ApiError('Product not found', 404);
    }

    return product;
};

export const updateProductService = async (userId, productId, updates) => {
    const user = await User.findById(userId);
    const product = await Product.findById(productId);

    if (!product) {
        throw new ApiError('Product not found.', 404);
    }

    if (user.role === 'seller' && product.seller.toString() !== userId.toString()) {
        throw new ApiError('You can only update you own products.', 403);
    }

    const updatedProduct = await Product.findByIdAndUpdate(productId, updates, { new: true, runValidators: true }).populate('seller', '_id userName');

    return updatedProduct;
};

export const deleteProductService = async (userId, productId) => {
    const user = await User.findById(userId);
    const product = await Product.findById(productId);

    if (!product) {
        throw new ApiError('Product not found', 404);
    }

    if (user.role === 'seller' && product.seller.toString() !== userId.toString()) {
        throw new ApiError('You can only delete your own products.', 403);
    }

    await Product.findByIdAndDelete(productId);

    return true;
};