import mongoose from "mongoose";

const subscribeemailSchema = new mongoose.Schema({
    email: { type: String, required: true, unique:true, maxlength:50  },
});

export const SubscribeEmail =
    mongoose.models.subscribeemails || mongoose.model("subscribeemails", subscribeemailSchema);