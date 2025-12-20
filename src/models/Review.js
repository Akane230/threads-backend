import mongoose from 'mongoose';

const ImagesSchema = new mongoose.Schema({
    filename: {
        type: String,
        required: true
    },
    mimetype: {
        type: String,
        required: true
    },
    data: {
        type: Buffer,
        required: true
    },
    size: {
        type: Number,
        required: false
    }
}, { _id: false });

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
        type: ImagesSchema,
        required: false,
        default: null
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


