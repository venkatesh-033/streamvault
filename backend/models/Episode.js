import mongoose from 'mongoose';

const episodeSchema = new mongoose.Schema({
  series: { type: mongoose.Schema.Types.ObjectId, ref: 'Series', required: true },
  title: { type: String, required: true, trim: true },
  seasonNumber: { type: Number, default: 1, min: 1 },
  episodeNumber: { type: Number, required: true, min: 1 },
  description: { type: String, default: '' },
  thumbnailUrl: { type: String, default: '' },
  durationSeconds: { type: Number, min: 0 },
  bunnyVideoId: { type: String, default: '' },
  videoStatus: { type: String, enum: ['not_uploaded', 'processing', 'ready', 'failed'], default: 'not_uploaded' },
  videoUploadedAt: { type: Date, default: null },
  published: { type: Boolean, default: false }
}, { timestamps: true });

episodeSchema.index({ series: 1, seasonNumber: 1, episodeNumber: 1 }, { unique: true });
export default mongoose.model('Episode', episodeSchema);
