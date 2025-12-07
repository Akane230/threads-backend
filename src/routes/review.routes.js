import express from 'express';
import {
    getAllReviews,
    getReview,
    createReview,
    updateReview,
    deleteReview
} from '../controllers/review.controller.js';

const router = express.Router();

router.get('/', getAllReviews);
router.get('/:id', getReview);
router.post('/', createReview);
router.put('/:id', updateReview);
router.delete('/:id', deleteReview);

export default router;

