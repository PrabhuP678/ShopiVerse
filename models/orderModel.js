import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    buyer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',  // Assuming you have a User model
        required: true,
    },
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',  // Assuming you have a Product model
            },
            quantity: {
                type: Number,
                required: true,
            },
        }
    ],
    totalPrice: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'shipped', 'delivered', 'cancelled'],
        default: 'pending',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
 
});

export default mongoose.model('Order', orderSchema);
