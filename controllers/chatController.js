import asyncHandler from 'express-async-handler';
import { sanitizeChatHistory } from '../utils/sanitizeData.js';
import { chatWithBotService, getChatHistoryService, clearChatHistoryService } from '../services/chatService.js';

// @desc    Generate chat response
// @route   POST /api/chat
// @access  Public
export const chatWithBotController = asyncHandler(async (req, res) => {
    const { message } = req.body;
    const userId = req.user?._id || null;

    const reply = await chatWithBotService(message, userId);

    res.status(200).json({
        success: true,
        data: reply
    });
});

// @desc    Get chat history
// @route   GET /api/chat/history
// @access  Private
export const getChatHistoryController = asyncHandler(async (req, res) => {
    const userId = req.user?._id || null;

    const history = await getChatHistoryService(userId);

    res.status(200).json({
        success: true,
        data: history.map(sanitizeChatHistory)
    });
});

// @desc    Clear chat history
// @route   DELETE /api/chat/history
// @access  Private
export const clearChatHistoryController = asyncHandler(async (req, res) => {
    const userId = req.user?._id || null;

    await clearChatHistoryService(userId);

    res.status(200).json({
        success: true,
        message: 'Chat history cleared successfully'
    });
});