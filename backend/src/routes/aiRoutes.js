import { Router } from 'express';
import * as aiController from '../controllers/aiController.js';

const router = Router();

router.post('/decompose', aiController.decompose);
router.post('/status-update', aiController.statusUpdate);
router.post('/parse-voice-task', aiController.parseVoiceTask);

export default router;
