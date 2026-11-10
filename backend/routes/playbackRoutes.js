import { Router } from 'express';
import crypto from 'crypto';
import mongoose from 'mongoose';
import Episode from '../models/Episode.js';

const router = Router();

// Only published episodes with completed processing can receive a short-lived embed URL.
router.get('/:episodeId', async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.episodeId)) return res.status(400).json({ message: 'Invalid episode ID' });
    const episode = await Episode.findOne({
      _id: req.params.episodeId,
      published: true,
      videoStatus: 'ready',
      bunnyVideoId: { $ne: '' }
    }).select('bunnyVideoId title').lean();

    if (!episode) return res.status(404).json({ message: 'This episode is not available for playback yet.' });

    const libraryId = process.env.BUNNY_LIBRARY_ID;
    const tokenKey = process.env.BUNNY_TOKEN_AUTH_KEY;
    if (!libraryId || !tokenKey) return res.status(503).json({ message: 'Playback is not configured on the server.' });

    const expires = Math.floor(Date.now() / 1000) + 300;
    const token = crypto.createHash('sha256')
      .update(tokenKey + episode.bunnyVideoId + expires)
      .digest('hex');

    const playbackUrl = `https://iframe.mediadelivery.net/embed/${libraryId}/${episode.bunnyVideoId}?token=${token}&expires=${expires}`;
    res.set('Cache-Control', 'no-store');
    res.json({ success: true, title: episode.title, playbackUrl, expires });
  } catch (error) { next(error); }
});

export default router;
