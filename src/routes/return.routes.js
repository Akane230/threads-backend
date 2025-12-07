import express from 'express';
import {
    getAllReturns,
    getReturn,
    createReturn,
    updateReturnStatus,
    deleteReturn
} from '../controllers/return.controller.js';

const router = express.Router();

router.get('/', getAllReturns);
router.get('/:id', getReturn);
router.post('/', createReturn);
router.put('/:id/status', updateReturnStatus);
router.delete('/:id', deleteReturn);

export default router;

