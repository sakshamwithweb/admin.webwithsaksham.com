import { Session } from "@/lib/models/session";
import connectDb from "@/lib/mongoose";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const sessionId = req.cookies.get('sessionId');
        const ipAddress = req.headers.get("x-forwarded-for") || req.connection.remoteAddress || "Unknown IP";
        const userAgent = req.headers.get("user-agent") || "Unknown User Agent";

        // if not exist
        if (!sessionId) return NextResponse.json({ success: false })

        await connectDb()

        // check valid
        const isValid = await Session.findOne({ id: sessionId.value })
        if (!isValid) return NextResponse.json({ success: false })

        if (isValid?.ipAddress !== ipAddress || isValid?.userAgent !== userAgent) {
            await Session.deleteMany({})
            return NextResponse.json({ success: false }) // If it is tried to use session Id in other
        }
        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json({ success: false })
    }
}