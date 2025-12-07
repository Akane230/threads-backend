import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

// Embedded Address Schema
const AddressSchema = new mongoose.Schema({
    address_type: {
        type: String,
        required: true
    },
    street: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    province: {
        type: String,
        required: true
    },
    postal_code: {
        type: String,
        required: true
    },
    is_default: {
        type: Boolean,
        default: false
    }
}, { _id: false });

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    profile_image: {
        type: String,
        default: null
    },
    wishlist_ids: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        index: true
    }],
    following_seller_ids: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Seller',
        index: true
    }],
    addresses: [AddressSchema],
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

// Hash password before saving
userSchema.pre('save', async function(next) {
    this.updated_at = Date.now();
    if (!this.isModified('password')) return next();

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Update updated_at timestamp
userSchema.pre('save', function(next) {
    this.updated_at = Date.now();
    next();
});

const User = mongoose.model('User', userSchema);

export default User;