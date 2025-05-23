import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
    ipAddress: { type: String, required: true },
    userAgent: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, index: { expires: '1h' } }
})

export const Session = mongoose.models.sessions || mongoose.model("sessions", sessionSchema)