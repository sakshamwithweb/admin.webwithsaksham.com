import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
    question: { type: String, required: true },
    resolves: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now, index: { expires: '60d' } }
});

export const Question =
    mongoose.models.questions || mongoose.model("questions", questionSchema);