import express from 'express';
import {
    getAllUsers,
    getUser,
    updateUser,
    deleteUser,
    addAddress,
    updateAddress,
    deleteAddress,
    addToWishlist,
    removeFromWishlist,
    followSeller,
    unfollowSeller
} from '../controllers/user.controller.js';

const router = express.Router();

router.get('/', getAllUsers);
router.get('/:id', getUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);
router.post('/:id/addresses', addAddress);
router.put('/:id/addresses/:addressIndex', updateAddress);
router.delete('/:id/addresses/:addressIndex', deleteAddress);
router.post('/:id/wishlist', addToWishlist);
router.delete('/:id/wishlist/:product_id', removeFromWishlist);
router.post('/:id/follow', followSeller);
router.delete('/:id/follow/:seller_id', unfollowSeller);

export default router;

