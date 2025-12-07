import express from 'express';
import {
    getAllReviews,
    getReview,
    createReview,
    updateReview,
    deleteReview
} from '../controllers/review.controller.js';

const router = express.Router();

// Get all reviews (with optional filters)
router.get('/', getAllReviews);

// Get single review
router.get('/:id', getReview);

// Create review
router.post('/', createReview);

// Update review
router.put('/:id', updateReview);

// Delete review
router.delete('/:id', deleteReview);

export default router;

