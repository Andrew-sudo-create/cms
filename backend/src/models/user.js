import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'user'], default: 'user' },
  firstName: { type: String },
  lastName: { type: String },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

export default User; // Export the model as default