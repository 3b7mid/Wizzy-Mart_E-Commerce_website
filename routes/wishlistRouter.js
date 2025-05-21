import express from "express";
import { protect, allowedTo } from "../middlewares/authMiddleware.js";
import { addProductToWishlistValidator, removeProductFromWishlistValidator } from "../validators/wishlistValidator.js";
import { addProductToWishlist, removeProductFromWishlist, getUserWishlist } from "../controllers/wishlistController.js";

const router = express.Router();

router.use(protect, allowedTo('user'));

router.route('/')
    .post(addProductToWishlistValidator, addProductToWishlist)
    .get(getUserWishlist);

router.route('/:productId')
    .delete(removeProductFromWishlistValidator, removeProductFromWishlist);

export default router;