export const sanitizeUser = (user) => {
    return {
        id: user._id,
        name: user.name,
        email: user.email,
        profileImage: user.profileImage,
        role: user.role,
        wishlist: user.wishlist,
        addresses: user.addresses,
        active: user.active
    };
};

export const sanitizeCategory = (category) => {
    return {
        id: category._id,
        name: category.name,
        categoryImage: category.categoryImage
    };
};

export const sanitizeSubCategory = (subcategory) => {
    return {
        id: subcategory._id,
        name: subcategory.name,
        category: subcategory.category
    };
};

export const sanitizeBrand = (brand) => {
    return {
        id: brand._id,
        name: brand.name,
        category: brand.category,
        subCategories: brand.subCategories
    };
};

export const sanitizeProduct = (product) => {
    return {
        id: product._id,
        title: product.title,
        quantity: product.quantity,
        sold: product.sold,
        description: product.description,
        price: product.price,
        colors: product.colors,
        imageCover: product.imageCover,
        images: product.images,
        // category: product.category,
        // subCategories: product.subCategories,
        brand: product.brand,
        reviews: product.reviews,
        ratingsAverage: product.ratingsAverage,
        ratingsQuantity: product.ratingsQuantity
    };
};

export const sanitizeReview = (review) => {
    return {
        id: review._id,
        title: review.title,
        ratings: review.ratings,
        user: review.user,
        product: review.product
    };
};

export const sanitizeCart = (cart) => {
    return {
        id: cart._id,
        numOfCartItems: cart.numOfCartItems,
        user: cart.user,
        cartItems: cart.cartItems,
        totalCartPrice: cart.totalCartPrice,
        totalPriceAfterDiscount: cart.totalPriceAfterDiscount
    };
};

export const sanitizeCoupon = (coupon) => {
    return {
        id: coupon._id,
        code: coupon.code,
        expiresAt: coupon.expiresAt,
        discount: coupon.discount
    };
};

export const sanitizeOrder = (order) => {
    return {
        id: order._id,
        user: order.user,
        cartItems: order.cartItems,
        shippingAddress: order.shippingAddress,
        shippingPrice: order.shippingPrice || 0,
        paymentMethodType: order.paymentMethodType,
        isPaid: order.isPaid || false,
        paidAt: order.paidAt || null,
        isDelivered: order.isDelivered || false,
        deliveredAt: order.deliveredAt || null,
        totalOrderPrice: order.totalOrderPrice || 0,
        totalPriceAfterDiscount: order.totalPriceAfterDiscount || order.totalOrderPrice,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt
    };
};

export const sanitizeshippingPrice = (shipPrice) => {
    return {
        id: shipPrice._id,
        shippingPrice: shipPrice.shippingPrice
    };
};