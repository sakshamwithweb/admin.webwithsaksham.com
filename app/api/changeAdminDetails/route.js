import { AdminDetails } from "@/lib/models/adminDetails"
import connectDb from "@/lib/mongoose"
import { NextResponse } from "next/server"

export async function POST(req) {
    try {
        const { section, changedData } = await req.json()
        await connectDb()
        const changes = await AdminDetails.findOneAndUpdate({ name: "Saksham" }, { [section]: changedData })
        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json({ success: false })
    }
}