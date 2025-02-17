import mongoose from 'mongoose';

const contentSchema = new mongoose.Schema({
    website: { type: mongoose.Schema.Types.ObjectId, ref: 'Website', required: true },
    type: {type: String, enum: ['text', 'image', 'video'], required: true},
    data: String // Store content data (text, image URL, video URL)
}, { timestamps: true });

export default mongoose.model('Content', contentSchema);