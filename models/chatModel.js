import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        message: String,
        reply: String
    },
    { timestamps: true }
);

export default mongoose.model('Chat', chatSchema);