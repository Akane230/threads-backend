import express from 'express';
import {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart
} from '../controllers/cart.controller.js';

const router = express.Router();

// Get user's cart
router.get('/:user_id', getCart);

// Add item to cart
router.post('/:user_id', addToCart);

// Update cart item quantity
router.put('/:user_id/:product_id', updateCartItem);

// Remove item from cart
router.delete('/:user_id/:product_id', removeFromCart);

// Clear cart
router.delete('/:user_id', clearCart);

export default router;

