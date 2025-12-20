import mongoose from 'mongoose';

const ProductImageSchema = new mongoose.Schema({
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

// Embedded Review Summary Schema
const ReviewSummarySchema = new mongoose.Schema({
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
    }
}, { _id: false });

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        index: true
    },
    description: {
        type: String,
        required: true
    },
    product_images: [{
        type: ProductImageSchema,
        default: null
    }],
    price: {
        type: Number,
        required: true,
        min: 0,
        index: true
    },
    stock_quantity: {
        type: Number,
        default: 0,
        min: 0,
        index: true
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'draft'],
        default: 'active',
        index: true
    },
    seller_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Seller',
        required: true,
        index: true
    },
    review_summary: {
        type: ReviewSummarySchema,
        default: () => ({ avg_rating: 0, rating_count: 0 })
    },
    category_id: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
        index: true
    }],
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

const Product = mongoose.model('Product', ProductSchema);
export default Product;


