import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    title: { type: String, required: true },
    reason: { type: String, required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Review', ReviewSchema);


