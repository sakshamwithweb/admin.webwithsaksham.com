import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
    question: { type: String, required: true, maxlength: 500 },
    resolves: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    resolveAt: { type: Date, default: null },
});

questionSchema.pre('findOneAndUpdate', function (next) {
    const update = this.getUpdate();
    if (update && update.resolves === true) {
        update.resolveAt = new Date();
    }
    next();
});

questionSchema.index({ resolveAt: 1 }, { expireAfterSeconds: 10 * 24 * 60 * 60 }); // 10 days

export const Question =
    mongoose.models.questions || mongoose.model("questions", questionSchema);