import mongoose from 'mongoose';
const seriesSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
  description: { type: String, default: '' }, posterUrl: { type: String, default: '' }, backdropUrl: { type: String, default: '' },
  genres: [{ type: String, trim: true }], releaseYear: Number, rating: { type: Number, min: 0, max: 10 },
  contentProvider: { type: String, default: '' }, featured: { type: Boolean, default: false }, published: { type: Boolean, default: false }
}, { timestamps: true });
export default mongoose.model('Series', seriesSchema);
