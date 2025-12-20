import mongoose from 'mongoose';

const ProductSnapshotSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    }
}, { _id: false });

const OrderItemSchema = new mongoose.Schema({
    product_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    product_snapshot: {
        type: ProductSnapshotSchema,
        required: true
    }
}, { _id: false });

const ShippingAddressSnapshotSchema = new mongoose.Schema({
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
    }
}, { _id: false });

const PaymentDetailsSchema = new mongoose.Schema({
    payment_method: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true,
        min: 0
    },
    transaction_id: {
        type: String
    },
    status: {
        enum: ['pending', 'paid', 'failed', 'refunded'],
        type: String,
        required: true
    }
}, { _id: false });

const ShipmentDetailsSchema = new mongoose.Schema({
    tracking_number: {
        type: String
    },
    carrier: {
        type: String
    },
    status: {
        enum: ['pending', 'shipped', 'out for delivery', 'delivered', 'returned'],
        type: String
    },
    estimated_delivery: {
        type: Date
    }
}, { _id: false });

const StatusHistorySchema = new mongoose.Schema({
    status: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    notes: {
        type: String
    }
}, { _id: false });

const OrderSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    order_total: {
        type: Number,
        required: true,
        min: 0
    },
    items: [OrderItemSchema],
    shipping_address_snapshot: {
        type: ShippingAddressSnapshotSchema,
        required: true
    },
    payment_details: {
        type: PaymentDetailsSchema
    },
    shipment_details: {
        type: ShipmentDetailsSchema
    },
    status_history: [StatusHistorySchema],
    created_at: {
        type: Date,
        default: Date.now,
        index: true
    }
}, {
    timestamps: false
});
const Order = mongoose.model('Order', OrderSchema);
export default Order;


