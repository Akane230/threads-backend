import express from 'express';
import {
    getAllSellers,
    getSeller,
    getSellerByUserId,
    createSeller,
    updateSeller,
    deleteSeller,
    getSellerProducts
} from '../controllers/seller.controller.js';

const router = express.Router();

// Get all sellers
router.get('/', getAllSellers);

// Get seller by user_id
router.get('/user/:user_id', getSellerByUserId);

// Get seller's products
router.get('/:id/products', getSellerProducts);

// Get single seller
router.get('/:id', getSeller);

// Create seller
router.post('/', createSeller);

// Update seller
router.put('/:id', updateSeller);

// Delete seller
router.delete('/:id', deleteSeller);

export default router;

