import express from 'express';
import {
    getAllReturns,
    getReturn,
    createReturn,
    updateReturnStatus,
    deleteReturn
} from '../controllers/return.controller.js';

const router = express.Router();

// Get all returns (with optional filters)
router.get('/', getAllReturns);

// Get single return
router.get('/:id', getReturn);

// Create return request
router.post('/', createReturn);

// Update return status
router.put('/:id/status', updateReturnStatus);

// Delete return
router.delete('/:id', deleteReturn);

export default router;

