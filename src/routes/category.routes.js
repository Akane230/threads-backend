import express from 'express';
import {
    getAllCategories,
    getCategory,
    createCategory,
    updateCategory,
    deleteCategory
} from '../controllers/category.controller.js';

const router = express.Router();

// Get all categories
router.get('/', getAllCategories);

// Get single category
router.get('/:id', getCategory);

// Create category
router.post('/', createCategory);

// Update category
router.put('/:id', updateCategory);

// Delete category
router.delete('/:id', deleteCategory);

export default router;

