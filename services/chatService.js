import 'dotenv/config';
import { GoogleGenAI } from '@google/genai';
import Chat from '../models/chatModel.js';

const genAi = new GoogleGenAI(process.env.GEMINI_API_KEY);

const systemInstruction = `
You are Wizzy bot, the virtual assistant for an online e-commerce store called Wizzy Mart.
Your job is to help customers with:
- Finding and comparing products (e.g. smartphones, headphones, TVs, consoles, accessories)
- Recommending best sellers or deals
- Explaining discounts, features, or delivery options
- Helping with shopping categories (like smartwatches, printers, etc.)

Respond in plain text with no markdown, no stars (**), and no line breaks (\\n).
Do NOT answer questions outside the e-commerce domain. If a user asks anything unrelated, reply:
"I'm here to help you with your shopping at Wizzy Mart. Please ask me something about our products or services."

Be friendly, helpful, and clear in your replies.
`;

export const chatWithBotService = async (message, userId) => {
    const result = await genAi.models.generateContent({
        model: 'gemini-2.0-flash',
        config: { systemInstruction },
        contents: [
            {
                role: 'user',
                parts: [{ text: message }],
            },
        ],
    });

    const reply = result.text;
    const cleanedReply = reply.replace(/\n/g, ' ');

    if (userId) {
        await Chat.create({ userId, message, reply: cleanedReply });
    }

    return cleanedReply;
};

export const getChatHistoryService = async (userId) => {
    return await Chat.find({ userId }).sort({ createdAt: -1 }).limit(50);
};

export const clearChatHistoryService = async (userId) => {
    return await Chat.deleteMany({ userId });
};