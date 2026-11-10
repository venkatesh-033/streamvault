import Series from '../models/Series.js';
import Episode from '../models/Episode.js';
export async function getSeries(req, res, next) {
  try {
    const { search, genre, featured } = req.query;
    const filter = { published: true };
    if (search) filter.title = { $regex: search, $options: 'i' };
    if (genre) filter.genres = genre;
    if (featured === 'true') filter.featured = true;
    const items = await Series.find(filter).sort({ createdAt: -1 }).limit(100).lean();
    res.json({ success: true, count: items.length, data: items });
  } catch (error) { next(error); }
}
export async function getSeriesBySlug(req, res, next) {
  try {
    const item = await Series.findOne({ slug: req.params.slug, published: true }).lean();
    if (!item) return res.status(404).json({ success: false, message: 'Series not found' });
    const episodes = await Episode.find({ series: item._id, published: true })
      .select('title seasonNumber episodeNumber description thumbnailUrl durationSeconds videoStatus')
      .sort({ seasonNumber: 1, episodeNumber: 1 }).lean();
    res.json({ success: true, data: { ...item, episodes } });
  } catch (error) { next(error); }
}
