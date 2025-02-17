import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'user'], default: 'user' },
  websites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Website' }] // Reference to websites
}, { timestamps: true });

export default mongoose.model('User', userSchema);