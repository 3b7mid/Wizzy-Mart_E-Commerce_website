import express from "express";
import { protect, allowedTo } from "../middlewares/authMiddleware.js";
import { addAddressValidator, userOwnsAddressValidator, updateAddressValidator } from "../validators/addressValidator.js";
import { addAddress, getAddresses, getAddress, updateAddress, removeAddress } from "../controllers/addressController.js";

const router = express.Router();

router.use(protect, allowedTo('user'));

router
    .route('/')
    .post(addAddressValidator, addAddress)
    .get(getAddresses);

router
    .route('/:addressId')
    .get(userOwnsAddressValidator, getAddress)
    .put(updateAddressValidator, updateAddress)
    .delete(userOwnsAddressValidator, removeAddress);

export default router;