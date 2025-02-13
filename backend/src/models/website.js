import mongoose from 'mongoose';

const websiteSchema = new mongoose.Schema({
  domain: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: String,
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

const Website = mongoose.model('Website', websiteSchema);

export default Website;