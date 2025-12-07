import express from 'express';
import {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart
} from '../controllers/cart.controller.js';

const router = express.Router();

router.get('/:user_id', getCart);
router.post('/:user_id', addToCart);
router.put('/:user_id/:product_id', updateCartItem);
router.delete('/:user_id/:product_id', removeFromCart);
router.delete('/:user_id', clearCart);

export default router;

