import { AdminDetails } from "@/lib/models/adminDetails";
import connectDb from "@/lib/mongoose";
import { NextResponse } from "next/server";
import DOMPurify from "isomorphic-dompurify";

// fetch admin details
export async function POST() {
    try {
        await connectDb()
        const data = await AdminDetails.findOne({ name: "Saksham" })
        if (!data) return NextResponse.json({ success: false, message: "Admin data not found" }, { status: 404 })
        return NextResponse.json({ data: data, success: true })
    } catch (error) {
        return NextResponse.json({ success: false, message: "Unable to fetch data admin data" }, { status: 500 })
    }
}

// change admin details
export async function PUT(req) {
    try {
        const { section, changedData } = await req.json()
        let sanitizedData;

        if (section === "about") {
            sanitizedData = Object.fromEntries(
                Object.entries(changedData).map(([key, value]) => {
                    return [key, DOMPurify.sanitize(value)];
                })
            );
        } else if (section === "knowledge") {
            sanitizedData = changedData.map((item) => {
                return Object.fromEntries(Object.entries(item).map(([key, value]) => {
                    return [key, value != 0 ? DOMPurify.sanitize(value) : value];
                }));
            })
        } else if (section === "project") {
            sanitizedData = changedData.map((item) => {
                return Object.fromEntries(Object.entries(item).map(([key, value]) => {
                    return [key, DOMPurify.sanitize(value)];
                }));
            })
        } else {
            return NextResponse.json({ success: false, message: "Invalid payload" }, { status: 422 })
        }
        if (!section || !sanitizedData) return NextResponse.json({ success: false, message: "Invalid payload" }, { status: 422 })
        await connectDb()
        await AdminDetails.findOneAndUpdate({ name: "Saksham" }, { [section]: sanitizedData })
        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json({ success: false, message: "Unable to change admin data" }, { status: 500 })
    }
}