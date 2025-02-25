import { Session } from "@/lib/models/session";
import connectDb from "@/lib/mongoose";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const sessionId = req.cookies.get('sessionId');
        const ipAddress = req.headers.get("x-forwarded-for") || req.connection.remoteAddress || "Unknown IP";
        const userAgent = req.headers.get("user-agent") || "Unknown User Agent";

        // if not exist
        if (!sessionId) return NextResponse.json({ success: false, message: "Session id is not valid" }, { status: 401 })

        await connectDb()

        // check valid
        const isValid = await Session.findOne({ _id: sessionId.value })
        if (!isValid) return NextResponse.json({ success: false, message: "Session id is not valid" }, { status: 401 })

        if (isValid?.ipAddress !== ipAddress || isValid?.userAgent !== userAgent) {
            await Session.deleteMany({})
            return NextResponse.json({ success: false, message: "Session id is not valid" }, { status: 401 }) // If it is tried to use session Id in other mobile or using other network
        }
        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json({ success: false, message: "Unable to check session" }, { status: 500 })
    }
}