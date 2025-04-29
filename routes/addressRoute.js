import express from "express";
import { protect, allowedTo } from "../services/authService.js";
import { addAddressValidator, removeAddressValidator } from "../validators/addressValidator.js";
import { addAddress, removeAddress, getLoggedUserAddresses} from "../services/addressService.js";

const router = express.Router();

router.use(protect, allowedTo('user'));

router.route('/')
    .post(addAddressValidator, addAddress)
    .get(getLoggedUserAddresses);

router.route('/:addressId')
    .delete(removeAddressValidator, removeAddress);

export default router;