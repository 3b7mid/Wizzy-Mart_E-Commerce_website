import ApiFeature from '../utils/apiFeatures.js';
import ApiError from '../utils/apiError.js';
import Category from '../models/categoryModel.js';

export const createCategoryService = async ({ name, slug, categoryImage }) => {
    const category = await Category.create({ name, slug, categoryImage });

    return category;
};

export const getCategoriesService = async (query) => {
    const totalCategories = await Category.countDocuments();

    const features = new ApiFeature(Category.find(), query)
        .filter()
        .sort()
        .limitFields()
        .search(['name'])
        .paginate(totalCategories)

    const categories = await features.mongooseQuery.exec();

    return {
        totalCategories,
        pagination: features.paginationResult,
        categories
    }
};

export const getCategoryService = async (categoryId) => {
    const category = await Category.findById(categoryId);

    if (!category) {
        throw new ApiError('Category not found.', 404);
    }

    return category;
};

export const updateCategoryService = async (categoryId, updates) => {
    const category = await Category.findByIdAndUpdate(categoryId, updates, { new: true, runValidators: true });
    if (!category) {
        throw new ApiError('Category not found.', 404);
    }

    return category;
};

export const deleteCategoryService = async (categoryId) => {
    const category = await Category.findByIdAndDelete(categoryId);

    if (!category) {
        throw new ApiError('Category not found.', 404);
    }

    return true;
};