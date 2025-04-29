import express from "express";
import { protect, allowedTo } from "../services/authService.js";
import { addProductToWishlistValidator, removeProductFromWishlistValidator } from "../validators/wishlistValidator.js";
import { addProductToWishlist, removeProductFromWishlist, getLoggedUserWishlist } from "../services/wishlistService.js";

const router = express.Router();

router.use(protect, allowedTo('user'));

router.route('/')
    .post(addProductToWishlistValidator, addProductToWishlist)
    .get(getLoggedUserWishlist);

router.route('/:productId')
    .delete(removeProductFromWishlistValidator, removeProductFromWishlist);

export default router;