import { Router } from 'express';
import { getSeries, getSeriesBySlug } from '../controllers/seriesController.js';
const router = Router();
router.get('/', getSeries);
router.get('/:slug', getSeriesBySlug);
export default router;
