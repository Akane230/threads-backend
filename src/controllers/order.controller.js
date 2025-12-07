import { Order, Product, User } from '../models/index.js';

// Get all orders (with optional user_id filter)
export const getAllOrders = async (req, res) => {
    try {
        const { user_id } = req.query;
        const query = user_id ? { user_id } : {};
        
        const orders = await Order.find(query)
            .populate('user_id', 'username email first_name last_name')
            .populate('items.product_id')
            .sort({ created_at: -1 });

        res.status(200).json({ 
            success: true,
            count: orders.length,
            orders 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: 'Server Error',
            error: error.message 
        });
    }
};

// Get single order
export const getOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const order = await Order.findById(id)
            .populate('user_id', 'username email first_name last_name')
            .populate('items.product_id');
        
        if (!order) {
            return res.status(404).json({ 
                success: false,
                message: 'Order not found' 
            });
        }

        res.status(200).json({ 
            success: true,
            order 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: 'Server Error',
            error: error.message 
        });
    }
};

// Create order
export const createOrder = async (req, res) => {
    try {
        const { 
            user_id, 
            items, 
            shipping_address_snapshot, 
            payment_details 
        } = req.body;

        if (!user_id || !items || !shipping_address_snapshot || !payment_details) {
            return res.status(400).json({ 
                success: false,
                message: 'User ID, items, shipping address, and payment details are required' 
            });
        }

        // Verify user exists
        const user = await User.findById(user_id);
        if (!user) {
            return res.status(404).json({ 
                success: false,
                message: 'User not found' 
            });
        }

        // Validate items and calculate total
        let order_total = 0;
        const orderItems = [];

        for (const item of items) {
            const product = await Product.findById(item.product_id);
            if (!product) {
                return res.status(404).json({ 
                    success: false,
                    message: `Product ${item.product_id} not found` 
                });
            }

            if (product.stock_quantity < item.quantity) {
                return res.status(400).json({ 
                    success: false,
                    message: `Insufficient stock for product ${product.name}` 
                });
            }

            const itemTotal = product.price * item.quantity;
            order_total += itemTotal;

            orderItems.push({
                product_id: item.product_id,
                quantity: item.quantity,
                product_snapshot: {
                    name: product.name,
                    price: product.price
                }
            });

            // Update product stock
            product.stock_quantity -= item.quantity;
            await product.save();
        }

        // Create order
        const order = new Order({
            user_id,
            order_total,
            items: orderItems,
            shipping_address_snapshot,
            payment_details,
            status_history: [{
                status: 'pending',
                date: new Date(),
                notes: 'Order created'
            }]
        });

        await order.save();
        await order.populate('user_id', 'username email first_name last_name');
        await order.populate('items.product_id');

        res.status(201).json({ 
            success: true,
            message: 'Order created successfully',
            order 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: 'Server Error',
            error: error.message 
        });
    }
};

// Update order status
export const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, notes, shipment_details } = req.body;

        if (!status) {
            return res.status(400).json({ 
                success: false,
                message: 'Status is required' 
            });
        }

        const order = await Order.findById(id);
        if (!order) {
            return res.status(404).json({ 
                success: false,
                message: 'Order not found' 
            });
        }

        // Add to status history
        order.status_history.push({
            status,
            date: new Date(),
            notes: notes || ''
        });

        // Update shipment details if provided
        if (shipment_details) {
            order.shipment_details = {
                ...order.shipment_details,
                ...shipment_details
            };
        }

        await order.save();
        await order.populate('user_id', 'username email first_name last_name');
        await order.populate('items.product_id');

        res.status(200).json({ 
            success: true,
            message: 'Order status updated',
            order 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: 'Server Error',
            error: error.message 
        });
    }
};

// Delete order
export const deleteOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const order = await Order.findByIdAndDelete(id);
        
        if (!order) {
            return res.status(404).json({ 
                success: false,
                message: 'Order not found' 
            });
        }

        res.status(200).json({ 
            success: true,
            message: 'Order deleted successfully' 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: 'Server Error',
            error: error.message 
        });
    }
};

