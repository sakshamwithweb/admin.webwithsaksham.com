import { AdminDetails } from "@/lib/models/adminDetails";
import connectDb from "@/lib/mongoose";
import { NextResponse } from "next/server";

// fetch admin details
export async function POST() {
    try {
        await connectDb()
        const data = await AdminDetails.findOne({ name: "Saksham" })
        if (!data) return NextResponse.json({ success: false, message: "Unable to fetch data" })
        return NextResponse.json({ data: data, success: true })
    } catch (error) {
        return NextResponse.json({ success: false, message: "Unable to fetch data" })
    }
}

// change admin details
export async function PUT(req) {
    try {
        const { section, changedData } = await req.json()
        if (!section || !changedData) throw new Error("something is wrong");
        await connectDb()
        const changes = await AdminDetails.findOneAndUpdate({ name: "Saksham" }, { [section]: changedData })
        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json({ success: false })
    }
}