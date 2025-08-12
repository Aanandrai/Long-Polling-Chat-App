import express from 'express';
import { sendMessage, pollMessages } from '../controllers/messageController.js';

const router = express.Router();

router.post('/', sendMessage);
router.get('/poll', pollMessages);

export default router;
