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

// Get all users
router.get('/', getAllUsers);

// Get single user
router.get('/:id', getUser);

// Update user
router.put('/:id', updateUser);

// Delete user
router.delete('/:id', deleteUser);

// Address routes
router.post('/:id/addresses', addAddress);
router.put('/:id/addresses/:addressIndex', updateAddress);
router.delete('/:id/addresses/:addressIndex', deleteAddress);

// Wishlist routes
router.post('/:id/wishlist', addToWishlist);
router.delete('/:id/wishlist/:product_id', removeFromWishlist);

// Follow seller routes
router.post('/:id/follow', followSeller);
router.delete('/:id/follow/:seller_id', unfollowSeller);

export default router;

