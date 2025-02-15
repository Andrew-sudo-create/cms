import mongoose from 'mongoose';

const contentSchema = new mongoose.Schema({
  website: { type: mongoose.Schema.Types.ObjectId, ref: 'Website', required: true },
  page: { type: String, required: true },
  content: { type: String },
  version: { type: Number, default: 1 },
  lastUpdated: { type: Date, default: Date.now },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

const Content = mongoose.model('Content', contentSchema);

export {Content};