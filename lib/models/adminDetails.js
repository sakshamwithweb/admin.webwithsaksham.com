import mongoose from "mongoose";

const adminDetailsSchema = new mongoose.Schema({
    name: { type: String, default: "Saksham" },
    about: { type: Object, required: true },
    knowledge: { type: Array, required: true },
    project: { type: Array, required: true },
})

export const AdminDetails = mongoose.models.adminDetails || mongoose.model("adminDetails", adminDetailsSchema)