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

router.get('/', getAllSellers);
router.get('/user/:user_id', getSellerByUserId);
router.get('/:id/products', getSellerProducts);
router.get('/:id', getSeller);
router.post('/', createSeller);
router.put('/:id', updateSeller);
router.delete('/:id', deleteSeller);

export default router;

