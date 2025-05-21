import ApiError from '../utils/apiError.js';
import Product from '../models/productModel.js';
import Coupon from '../models/couponModel.js';
import Cart from '../models/cartModel.js';

// Helper function to calculate cart totals
const calcTotalCartPrice = (cart) => {
    let totalPrice = 0;
    cart.cartItems.forEach((item) => { totalPrice += item.amount * item.price; });
    cart.totalCartPrice = totalPrice;

    if (cart.totalPriceAfterDiscount) {
        cart.totalPriceAfterDiscount = Math.min(cart.totalPriceAfterDiscount, totalPrice);
    }
};

export const addProductToCartService = async (userId, cartData) => {
    const { productId, color, amount } = cartData;

    const product = await Product.findById(productId);

    if (!product) {
        throw new ApiError('Product not found', 404);
    }

    if (product.quantity <= 0) {
        throw new ApiError('Product is out of stock', 400);
    }

    if (amount > product.quantity) {
        throw new ApiError('Requested amount exceeds available stock', 400);
    }

    if (!product.colors.includes(color)) {
        throw new ApiError('Selected color is not available for this product', 400);
    }

    let cart = await Cart.findOne({ user: userId, status: 'active' });
    if (!cart) {
        cart = await Cart.create({
            user: userId,
            cartItems: [{ product: productId, color, price: product.price, amount }]
        });
    } else {
        const productIndex = cart.cartItems.findIndex(
            (item) => item.product.toString() === productId && item.color === color
        );

        if (productIndex > -1) {
            const newAmount = cart.cartItems[productIndex].amount + amount;
            if (newAmount > product.quantity) {
                throw new ApiError('Requested amount exceeds available stock', 400);
            }
            cart.cartItems[productIndex].amount = newAmount;
        } else {
            cart.cartItems.push({ product: productId, color, price: product.price, amount });
        }
    }

    calcTotalCartPrice(cart);
    await cart.save();

    return cart.populate('cartItems.product');
};

export const getUserCartService = async (userId) => {
    const cart = await Cart.findOne({ user: userId, status: 'active' });

    if (!cart) {
        throw new ApiError('Cart not found', 404);
    }

    return cart;
};

export const updateCartItemService = async (userId, itemId, updateData) => {
    const { amount, color } = updateData;

    const cart = await Cart.findOne({ user: userId, status: 'active' });
    if (!cart) {
        throw new ApiError('Cart not found.', 404);
    }

    let itemIndex = cart.cartItems.findIndex(item => {
        if (!item || !item.product) return false;
        const productId = item.product.toString();
        return productId === itemId;
    });

    if (itemIndex === -1) {
        const itemIndexByCartItemId = cart.cartItems.findIndex(item => {
            if (!item || !item._id) return false;
            const cartItemId = item._id.toString();
            return cartItemId === itemId;
        });

        if (itemIndexByCartItemId === -1) {
            throw new ApiError('Cart item not found.', 404);
        }
        itemIndex = itemIndexByCartItemId;
    }

    const cartItem = cart.cartItems[itemIndex];
    const product = await Product.findById(cartItem.product);
    if (!product) {
        throw new ApiError('Product not found', 404);
    }

    if (product.quantity <= 0) {
        throw new ApiError('Product is out of stock', 400);
    }

    if (amount) {
        if (amount > product.quantity) {
            throw new ApiError('Requested amount exceeds available stock.', 400);
        }
        cartItem.amount = amount;
    }

    if (color) {
        if (!product.colors.includes(color)) {
            throw new ApiError('Selected color is not available for this product.', 400);
        }
        cartItem.color = color;
    }

    cart.cartItems[itemIndex] = cartItem;

    calcTotalCartPrice(cart);

    if (cart.coupon) {
        const coupon = await Coupon.findById(cart.coupon);
        if (coupon) {
            const discountAmount = coupon.calculateDiscount(cart.totalCartPrice);
            cart.totalPriceAfterDiscount = Number((cart.totalCartPrice - discountAmount).toFixed(2));
            cart.savings = discountAmount;
        }
    }

    await cart.save();

    return cart;
};

export const removeSpecificCartItemService = async (userId, itemId) => {
    const cart = await Cart.findOne({ user: userId, status: 'active' });
    if (!cart) {
        throw new ApiError('Cart not found', 404);
    }

    const itemIdStr = itemId.toString();
    const itemIndex = cart.cartItems.findIndex(item => item && item.product && item.product.toString() === itemIdStr);

    if (itemIndex === -1) {
        throw new ApiError('Cart item not found', 404);
    }

    const cartItemId = cart.cartItems[itemIndex]._id;
    const updatedCart = await Cart.findOneAndUpdate(
        { _id: cart._id },
        { $pull: { cartItems: { product: itemIdStr } } },
        { new: true, runValidators: true }
    );

    if (!updatedCart) {
        throw new ApiError('Failed to remove item from cart', 500);
    }

    calcTotalCartPrice(updatedCart);
    await updatedCart.save();

    return updatedCart;
};

export const clearCartService = async (userId) => {
    const cart = await Cart.findOne({ user: userId, status: 'active' });

    if (!cart) {
        throw new ApiError('Cart not found.', 404);
    }

    if (cart.cartItems.length === 0) {
        throw new ApiError('Cart is already empty.', 400);
    }

    const updatedCart = await Cart.findOneAndDelete({ user: userId, status: 'active' });

    if (!updatedCart) {
        throw new ApiError('Failed to clear cart', 500);
    }

    return true;
};

export const applyCouponService = async (userId, couponCode) => {
    const cart = await Cart.findOne({ user: userId, status: 'active' });
    if (!cart) {
        throw new ApiError('Cart not found', 404);
    }

    if (cart.cartItems.length === 0) {
        throw new ApiError('Cannot apply coupon to empty cart', 400);
    }

    if (cart.coupon) {
        throw new ApiError('A coupon is already applied to your cart', 400);
    }

    const coupon = await Coupon.findOne({ code: couponCode.toUpperCase(), expiresAt: { $gt: Date.now() } });
    if (!coupon) {
        throw new ApiError('Coupon is invalid or expired', 400);
    }

    if (!coupon.canBeUsed(cart.totalCartPrice)) {
        throw new ApiError(`Cart total must be at least ${coupon.minPurchase} to apply this coupon`, 400);
    }

    if (coupon.categories && coupon.categories.length > 0) {
        const cartCategories = cart.cartItems.map(item => item.product.category.toString());
        const hasValidCategory = coupon.categories.some(catId => cartCategories.includes(catId.toString()));
        if (!hasValidCategory) {
            throw new ApiError('This coupon is not valid for items in your cart', 400);
        }
    }

    if (coupon.products && coupon.products.length > 0) {
        const cartProducts = cart.cartItems.map(item => item.product._id.toString());
        const hasValidProduct = coupon.products.some(prodId => cartProducts.includes(prodId.toString()));
        if (!hasValidProduct) {
            throw new ApiError('This coupon is not valid for items in your cart', 400);
        }
    }

    const discountAmount = coupon.calculateDiscount(cart.totalCartPrice);
    const finalPrice = Number((cart.totalCartPrice - discountAmount).toFixed(2));

    const updatedCart = await Cart.findOneAndUpdate(
        { _id: cart._id },
        {
            $set: {
                coupon: coupon._id,
                totalPriceAfterDiscount: finalPrice,
                savings: discountAmount
            }
        },
        { new: true, runValidators: true }
    );

    if (!updatedCart) {
        throw new ApiError('Failed to apply coupon', 500);
    }

    return updatedCart;
};