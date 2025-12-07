import mongoose from 'mongoose';

// Embedded Rating Summary Schema
const RatingSummarySchema = new mongoose.Schema({
    avg_rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    rating_count: {
        type: Number,
        default: 0,
        min: 0
    },
    num_products: {
        type: Number,
        default: 0,
        min: 0
    }
}, { _id: false });

const SellerSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true,
        index: true
    },
    store_name: {
        type: String,
        required: true,
        index: true
    },
    store_description: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    contact_number: {
        type: String,
        required: true
    },
    rating_summary: {
        type: RatingSummarySchema,
        default: () => ({ avg_rating: 0, rating_count: 0, num_products: 0 })
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

const Seller = mongoose.model('Seller', SellerSchema);
export default Seller;


