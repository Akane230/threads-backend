import { Cart, Product } from '../models/index.js';

// Get user's cart
export const getCart = async (req, res) => {
    try {
        const { user_id } = req.params;
        const cart = await Cart.findOne({ user_id }).populate('items.product_id');
        
        if (!cart) {
            return res.status(404).json({ 
                success: false,
                message: 'Cart not found' 
            });
        }

        res.status(200).json({ 
            success: true,
            cart 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: 'Server Error',
            error: error.message 
        });
    }
};

// Add item to cart
export const addToCart = async (req, res) => {
    try {
        const { user_id } = req.params;
        const { product_id, quantity } = req.body;

        if (!product_id || !quantity || quantity < 1) {
            return res.status(400).json({ 
                success: false,
                message: 'Product ID and valid quantity are required' 
            });
        }

        // Verify product exists
        const product = await Product.findById(product_id);
        if (!product) {
            return res.status(404).json({ 
                success: false,
                message: 'Product not found' 
            });
        }

        // Check stock availability
        if (product.stock_quantity < quantity) {
            return res.status(400).json({ 
                success: false,
                message: 'Insufficient stock' 
            });
        }

        let cart = await Cart.findOne({ user_id });

        if (!cart) {
            // Create new cart
            cart = new Cart({
                user_id,
                items: [{ product_id, quantity }]
            });
        } else {
            // Check if product already in cart
            const existingItemIndex = cart.items.findIndex(
                item => item.product_id.toString() === product_id
            );

            if (existingItemIndex > -1) {
                // Update quantity
                const newQuantity = cart.items[existingItemIndex].quantity + quantity;
                if (product.stock_quantity < newQuantity) {
                    return res.status(400).json({ 
                        success: false,
                        message: 'Insufficient stock for requested quantity' 
                    });
                }
                cart.items[existingItemIndex].quantity = newQuantity;
            } else {
                // Add new item
                cart.items.push({ product_id, quantity });
            }
        }

        await cart.save();
        await cart.populate('items.product_id');

        res.status(200).json({ 
            success: true,
            message: 'Item added to cart',
            cart 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: 'Server Error',
            error: error.message 
        });
    }
};

// Update cart item quantity
export const updateCartItem = async (req, res) => {
    try {
        const { user_id, product_id } = req.params;
        const { quantity } = req.body;

        if (!quantity || quantity < 1) {
            return res.status(400).json({ 
                success: false,
                message: 'Valid quantity is required' 
            });
        }

        const cart = await Cart.findOne({ user_id });
        if (!cart) {
            return res.status(404).json({ 
                success: false,
                message: 'Cart not found' 
            });
        }

        const itemIndex = cart.items.findIndex(
            item => item.product_id.toString() === product_id
        );

        if (itemIndex === -1) {
            return res.status(404).json({ 
                success: false,
                message: 'Item not found in cart' 
            });
        }

        // Check stock availability
        const product = await Product.findById(product_id);
        if (!product || product.stock_quantity < quantity) {
            return res.status(400).json({ 
                success: false,
                message: 'Insufficient stock' 
            });
        }

        cart.items[itemIndex].quantity = quantity;
        await cart.save();
        await cart.populate('items.product_id');

        res.status(200).json({ 
            success: true,
            message: 'Cart item updated',
            cart 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: 'Server Error',
            error: error.message 
        });
    }
};

// Remove item from cart
export const removeFromCart = async (req, res) => {
    try {
        const { user_id, product_id } = req.params;

        const cart = await Cart.findOne({ user_id });
        if (!cart) {
            return res.status(404).json({ 
                success: false,
                message: 'Cart not found' 
            });
        }

        cart.items = cart.items.filter(
            item => item.product_id.toString() !== product_id
        );

        await cart.save();
        await cart.populate('items.product_id');

        res.status(200).json({ 
            success: true,
            message: 'Item removed from cart',
            cart 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: 'Server Error',
            error: error.message 
        });
    }
};

// Clear cart
export const clearCart = async (req, res) => {
    try {
        const { user_id } = req.params;

        const cart = await Cart.findOne({ user_id });
        if (!cart) {
            return res.status(404).json({ 
                success: false,
                message: 'Cart not found' 
            });
        }

        cart.items = [];
        await cart.save();

        res.status(200).json({ 
            success: true,
            message: 'Cart cleared',
            cart 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: 'Server Error',
            error: error.message 
        });
    }
};

