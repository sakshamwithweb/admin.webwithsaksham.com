import mongoose from "mongoose";

const subscribeemailSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
});

export const SubscribeEmail =
    mongoose.models.subscribeemails || mongoose.model("subscribeemails", subscribeemailSchema);