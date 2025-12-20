import mongoose from 'mongoose';

const CartItemSchema = new mongoose.Schema({
    product_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    }
}, {
    _id: false
});

const CartSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true,
        index: true
    },
    items: [CartItemSchema],
    updated_at: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: false
});

CartSchema.pre('save', function(next) {
    this.updated_at = Date.now();
    next();
});

const Cart = mongoose.model('Cart', CartSchema);
export default Cart;


