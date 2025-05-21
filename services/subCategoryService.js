import ApiFeature from '../utils/apiFeatures.js';
import ApiError from '../utils/apiError.js';
import SubCategory from '../models/subCategoryModel.js';

export const createSubCategoryService = async ({ name, slug, category }) => {
    const subCategory = await SubCategory.create({ name, slug, category });

    return subCategory;
};

export const getSubCategoriesService = async (query) => {
    const totalSubCategories = await SubCategory.countDocuments();

    const features = new ApiFeature(SubCategory.find(), query)
        .filter()
        .sort()
        .limitFields()
        .search(['name'])
        .paginate(totalSubCategories)

    const subCategories = await features.mongooseQuery.exec();

    return {
        totalSubCategories,
        pagination: features.paginationResult,
        subCategories
    };
};

export const getSubCategoryService = async (subcategoryId) => {
    const subCategory = await SubCategory.findById(subcategoryId);

    if (!subCategory) {
        throw new ApiError('SubCategory not found.', 404);
    }

    return subCategory;
};

export const updateSubCategoryService = async (subcategoryId, updates) => {
    const subCategory = await SubCategory.findByIdAndUpdate(subcategoryId, updates, { new: true, runValidators: true });
    if (!subCategory) {
        throw new ApiError('SubCategory not found.', 404);
    }

    return subCategory;
};

export const deleteSubCategoryService = async (subcategoryId) => {
    const subCategory = await SubCategory.findByIdAndDelete(subcategoryId);

    if (!subCategory) {
        throw new ApiError('SubCategory not found.', 404);
    }

    return true;
};