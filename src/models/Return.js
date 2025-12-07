import mongoose from 'mongoose';

const ReturnSchema = new mongoose.Schema({
    order_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true,
        index: true
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    reason: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected', 'processing', 'completed'],
        default: 'pending',
        index: true
    },
    created_at: {
        type: Date,
        default: Date.now,
        index: true
    }
}, {
    timestamps: false
});

const Return = mongoose.model('Return', ReturnSchema);
export default Return;

