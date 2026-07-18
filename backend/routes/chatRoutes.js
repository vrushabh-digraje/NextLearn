import express from 'express';
import {
  getChatHistory,
  sendMessageToAI,
  clearChatHistory,
} from '../controllers/chatController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/:courseId')
  .get(protect, getChatHistory)
  .post(protect, sendMessageToAI)
  .delete(protect, clearChatHistory);

export default router;
