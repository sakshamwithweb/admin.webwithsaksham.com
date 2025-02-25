import { Admin } from "@/lib/models/admin"
import connectDb from "@/lib/mongoose"
import { NextResponse } from "next/server"
import bcrypt from "bcrypt"
import { Session } from "@/lib/models/session";
import DOMPurify from "isomorphic-dompurify";

async function CheckHashPass(userPass, hashPass) {
    try {
        const result = await bcrypt.compare(userPass, hashPass);
        return result;
    } catch (err) {
        console.error("Error comparing passwords:", err);
        return false;
    }
}

export async function POST(req) {
    try {
        const { userName, pass } = await req.json()
        const sanitizedUserName = DOMPurify.sanitize(userName);
        const sanitizedPass = DOMPurify.sanitize(pass);
        if (!sanitizedUserName || !sanitizedPass || sanitizedUserName?.length == 0 || sanitizedPass?.length == 0) return NextResponse.json({ success: false, message: "Invalid payload" }, { status: 422 })
        await connectDb()
        const admin = await Admin.findOne({ userName: sanitizedUserName })
        if (!admin) return NextResponse.json({ success: false, message: "Invalid payload" }, { status: 422 })
        const checkPass = await CheckHashPass(sanitizedPass, admin.pass)
        if (checkPass != true) return NextResponse.json({ success: false, message: "Invalid payload" }, { status: 422 })

        // Delete previous sessions
        await Session.deleteMany({})

        // Get session and return session
        const ipAddress = req.headers.get("x-forwarded-for") || req.connection.remoteAddress || "Unknown IP";
        const userAgent = req.headers.get("user-agent") || "Unknown User Agent";
        const newSession = new Session({
            ipAddress: ipAddress,
            userAgent: userAgent,
        })
        const result = await newSession.save()
        const sessionId = result._id.toString()

        // set the session in cookies section
        const response = NextResponse.json({ success: true });
        response.cookies.set('sessionId', sessionId, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
            maxAge: 60 * 60 * 1000,
        });

        return response;
    } catch (error) {
        return NextResponse.json({ success: false, message: "Unable to login" }, { status: 500 })
    }
}