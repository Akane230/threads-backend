import express from 'express';
import {
    getAllOrders,
    getOrder,
    createOrder,
    updateOrderStatus,
    deleteOrder
} from '../controllers/order.controller.js';

const router = express.Router();

// Get all orders (with optional user_id query param)
router.get('/', getAllOrders);

// Get single order
router.get('/:id', getOrder);

// Create order
router.post('/', createOrder);

// Update order status
router.put('/:id/status', updateOrderStatus);

// Delete order
router.delete('/:id', deleteOrder);

export default router;

