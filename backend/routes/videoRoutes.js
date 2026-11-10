
import { Router } from 'express';
import multer from 'multer';
import mongoose from 'mongoose';
import Episode from '../models/Episode.js';
import { requireAdmin } from '../middleware/adminAuth.js';
import {
  createBunnyVideo,
  uploadBunnyVideo,
  getBunnyVideo
} from '../services/bunnyService.js';

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 200 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!['video/mp4', 'video/quicktime', 'video/webm'].includes(file.mimetype)) {
      return cb(new Error('Upload an MP4, MOV or WebM video.'));
    }
    cb(null, true);
  }
});

// All video-management endpoints require admin authentication.
router.use(requireAdmin);

// Upload a video file directly through StreamVault.
router.post('/episodes/:episodeId/upload', upload.single('video'), async (req, res, next) => {
  let bunnyVideoId;

  try {
    if (!mongoose.isValidObjectId(req.params.episodeId)) {
      return res.status(400).json({ message: 'Invalid episode ID' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'Choose a video file first.' });
    }

    const episode = await Episode.findById(req.params.episodeId);

    if (!episode) {
      return res.status(404).json({ message: 'Episode not found' });
    }

    bunnyVideoId = await createBunnyVideo(
      `${episode.title} - S${episode.seasonNumber}E${episode.episodeNumber}`
    );

    await uploadBunnyVideo(bunnyVideoId, req.file.buffer);

    episode.bunnyVideoId = bunnyVideoId;
    episode.videoStatus = 'processing';
    episode.videoUploadedAt = new Date();

    await episode.save();

    return res.status(201).json({
      success: true,
      message: 'Upload completed. Bunny is processing the video.',
      videoStatus: episode.videoStatus,
      bunnyVideoId
    });
  } catch (error) {
    console.error('Bunny upload error:', error.response?.data || error.message);

    if (bunnyVideoId) {
      try {
        const episode = await Episode.findById(req.params.episodeId);

        if (episode) {
          episode.bunnyVideoId = bunnyVideoId;
          episode.videoStatus = 'failed';
          await episode.save();
        }
      } catch {}
    }

    next(error);
  }
});

// Attach a video that was already uploaded to Bunny Stream.
router.post('/episodes/:episodeId/attach-bunny', async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.episodeId)) {
      return res.status(400).json({ message: 'Invalid episode ID' });
    }

    const bunnyVideoId = String(req.body.bunnyVideoId || '').trim();

    if (!bunnyVideoId) {
      return res.status(400).json({
        message: 'Please provide a Bunny Video ID.'
      });
    }

    const episode = await Episode.findById(req.params.episodeId);

    if (!episode) {
      return res.status(404).json({ message: 'Episode not found' });
    }

    // Verify that this video exists in your configured Bunny library.
    const video = await getBunnyVideo(bunnyVideoId);

    const encodeProgress = Number(video.encodeProgress || 0);

    episode.bunnyVideoId = bunnyVideoId;
    episode.videoStatus = encodeProgress >= 100 ? 'ready' : 'processing';
    episode.videoUploadedAt = new Date();

    await episode.save();

    return res.json({
      success: true,
      message: 'Bunny video successfully attached to episode.',
      bunnyVideoId,
      videoStatus: episode.videoStatus,
      encodeProgress
    });
  } catch (error) {
    console.error('Bunny attach error:', error.response?.data || error.message);
    next(error);
  }
});

// Refresh the processing status of an attached Bunny video.
router.post('/episodes/:episodeId/refresh-status', async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.episodeId)) {
      return res.status(400).json({ message: 'Invalid episode ID' });
    }

    const episode = await Episode.findById(req.params.episodeId);

    if (!episode?.bunnyVideoId) {
      return res.status(404).json({
        message: 'No Bunny video is attached to this episode'
      });
    }

    const video = await getBunnyVideo(episode.bunnyVideoId);

    if (Number(video.encodeProgress) >= 100) {
      episode.videoStatus = 'ready';
    } else {
      episode.videoStatus = 'processing';
    }

    await episode.save();

    return res.json({
      success: true,
      videoStatus: episode.videoStatus,
      encodeProgress: video.encodeProgress ?? null
    });
  } catch (error) {
    console.error('Bunny status error:', error.response?.data || error.message);
    next(error);
  }
});

export default router;
