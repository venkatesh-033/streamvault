import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { connectDB } from './config/db.js';
import seriesRoutes from './routes/seriesRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import videoRoutes from './routes/videoRoutes.js';
import playbackRoutes from './routes/playbackRoutes.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';
const app = express();
app.set("trust proxy", 1);
app.use(helmet());
const allowedOrigins = [
  "https://desimaal.online",
  "https://www.desimaal.online",
  "https://streamvault-jade.vercel.app",
  "https://streamvault-vps-projects-ea70b8e2.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS: " + origin));
    }
  },
  credentials: true
}));
app.use(express.json({ limit: '1mb' }));
if (process.env.NODE_ENV !== 'production') app.use(morgan('dev'));
app.get('/api/health', (req, res) => res.json({ success: true, message: 'StreamVault API is running' }));
app.use('/api/series', seriesRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/playback', playbackRoutes);
app.use(notFound);
app.use(errorHandler);
const PORT = process.env.PORT || 5000;
connectDB().then(() => app.listen(PORT, () => console.log(`API running at http://localhost:${PORT}`)))
  .catch((error) => { console.error(`Startup failed: ${error.message}`); process.exit(1); });
