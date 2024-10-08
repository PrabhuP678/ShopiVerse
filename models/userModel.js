import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    password: { type: String, required: true },
    // answer: { type: String, required: true },
    role: { type: Number, default: 0 },
}, { timestamps: true });

const userModel = mongoose.model('userauth', userSchema);

export default userModel;
