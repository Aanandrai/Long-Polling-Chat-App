import express from 'express';
import { heartbeat, getOnlineUsers } from '../controllers/userController.js';

const router = express.Router();

router.post('/heartbeat', heartbeat);
router.get('/online', getOnlineUsers);

export default router;
