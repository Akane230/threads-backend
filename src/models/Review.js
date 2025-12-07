import mongoose from 'mongoose';

const ReviewSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    product_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
        index: true
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true,
        index: true
    },
    comment: {
        type: String,
        required: true
    },
    images: [{
        type: String
    }],
    created_at: {
        type: Date,
        default: Date.now,
        index: true
    }
}, {
    timestamps: false
});

const Review = mongoose.model('Review', ReviewSchema);
export default Review;


