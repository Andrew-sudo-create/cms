import mongoose from 'mongoose';

const websiteSchema = new mongoose.Schema({
  domain: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: String,
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Content' }]
}, { timestamps: true });

export default mongoose.model('Website', websiteSchema);