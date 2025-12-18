import express from 'express';
import { getStylingRecommendations } from '../controllers/aiStylingController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.post('/styling-recommendations', protect, getStylingRecommendations);

export default router;
