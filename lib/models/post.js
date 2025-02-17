import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    publishedTime: { type: String, required: true },
    categoryValue: { type: String, required: true},
});

export const Post =
    mongoose.models.posts || mongoose.model("posts", postSchema);