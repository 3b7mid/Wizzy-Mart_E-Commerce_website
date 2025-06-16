import express from 'express';
import { optionalAuth} from '../middlewares/authMiddleware.js';
import { chatMessageValidator } from '../validators/chatValidator.js';
import { chatWithBotController, getChatHistoryController, clearChatHistoryController } from '../controllers/chatController.js';

const router = express.Router();

router.post('/', optionalAuth, chatMessageValidator, chatWithBotController);

router
    .route('/history')
    .get(optionalAuth, getChatHistoryController)
    .delete(optionalAuth, clearChatHistoryController);

export default router; 