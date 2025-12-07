import express from 'express';
import {
    getAllProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct
} from '../controllers/product.controller.js';

const router = express.Router();

// Get all products (with filters)
router.get('/', getAllProducts);

// Get single product
router.get('/:id', getProduct);

// Create product
router.post('/', createProduct);

// Update product
router.put('/:id', updateProduct);

// Delete product
router.delete('/:id', deleteProduct);

export default router;

