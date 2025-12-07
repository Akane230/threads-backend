import { Return, Order, User } from '../models/index.js';

// Get all returns (with optional filters)
export const getAllReturns = async (req, res) => {
    try {
        const { user_id, order_id, status } = req.query;
        const query = {};

        if (user_id) query.user_id = user_id;
        if (order_id) query.order_id = order_id;
        if (status) query.status = status;

        const returns = await Return.find(query)
            .populate('user_id', 'username email first_name last_name')
            .populate('order_id')
            .sort({ created_at: -1 });

        res.status(200).json({ 
            success: true,
            count: returns.length,
            returns 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: 'Server Error',
            error: error.message 
        });
    }
};

// Get single return
export const getReturn = async (req, res) => {
    try {
        const { id } = req.params;
        const returnRequest = await Return.findById(id)
            .populate('user_id', 'username email first_name last_name')
            .populate('order_id');
        
        if (!returnRequest) {
            return res.status(404).json({ 
                success: false,
                message: 'Return request not found' 
            });
        }

        res.status(200).json({ 
            success: true,
            return: returnRequest 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: 'Server Error',
            error: error.message 
        });
    }
};

// Create return request
export const createReturn = async (req, res) => {
    try {
        const { order_id, user_id, reason } = req.body;

        if (!order_id || !user_id || !reason) {
            return res.status(400).json({ 
                success: false,
                message: 'Order ID, user ID, and reason are required' 
            });
        }

        // Verify order exists
        const order = await Order.findById(order_id);
        if (!order) {
            return res.status(404).json({ 
                success: false,
                message: 'Order not found' 
            });
        }

        // Verify user exists and owns the order
        const user = await User.findById(user_id);
        if (!user) {
            return res.status(404).json({ 
                success: false,
                message: 'User not found' 
            });
        }

        if (order.user_id.toString() !== user_id) {
            return res.status(403).json({ 
                success: false,
                message: 'You do not have permission to return this order' 
            });
        }

        // Check if return already exists for this order
        const existingReturn = await Return.findOne({ order_id, user_id });
        if (existingReturn) {
            return res.status(400).json({ 
                success: false,
                message: 'Return request already exists for this order' 
            });
        }

        const returnRequest = new Return({
            order_id,
            user_id,
            reason,
            status: 'pending'
        });

        await returnRequest.save();
        await returnRequest.populate('user_id', 'username email first_name last_name');
        await returnRequest.populate('order_id');

        res.status(201).json({ 
            success: true,
            message: 'Return request created successfully',
            return: returnRequest 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: 'Server Error',
            error: error.message 
        });
    }
};

// Update return status
export const updateReturnStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!status) {
            return res.status(400).json({ 
                success: false,
                message: 'Status is required' 
            });
        }

        const validStatuses = ['pending', 'approved', 'rejected', 'processing', 'completed'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ 
                success: false,
                message: `Status must be one of: ${validStatuses.join(', ')}` 
            });
        }

        const returnRequest = await Return.findById(id);
        if (!returnRequest) {
            return res.status(404).json({ 
                success: false,
                message: 'Return request not found' 
            });
        }

        returnRequest.status = status;
        await returnRequest.save();
        await returnRequest.populate('user_id', 'username email first_name last_name');
        await returnRequest.populate('order_id');

        res.status(200).json({ 
            success: true,
            message: 'Return status updated',
            return: returnRequest 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: 'Server Error',
            error: error.message 
        });
    }
};

// Delete return
export const deleteReturn = async (req, res) => {
    try {
        const { id } = req.params;
        const returnRequest = await Return.findByIdAndDelete(id);
        
        if (!returnRequest) {
            return res.status(404).json({ 
                success: false,
                message: 'Return request not found' 
            });
        }

        res.status(200).json({ 
            success: true,
            message: 'Return request deleted successfully' 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: 'Server Error',
            error: error.message 
        });
    }
};

