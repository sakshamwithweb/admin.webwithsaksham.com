import mongoose from "mongoose";


const adminSchema = new mongoose.Schema({
    userName: { type: String, required: true },
    pass: { type: String, required: true }
})

export const Admin = mongoose.models.admins || mongoose.model("admins", adminSchema)