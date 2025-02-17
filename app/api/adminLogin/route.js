import { Admin } from "@/lib/models/admin"
import connectDb from "@/lib/mongoose"
import { NextResponse } from "next/server"
import bcrypt from "bcrypt"
import { rateLimit } from "@/lib/rateLimit";
import { Session } from "@/lib/models/session";

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
        const isAllowed = await rateLimit(req);
        if (!isAllowed) return NextResponse.json({ success: false, error: "Too many requests, try 5 minutes later" });
        const { userName, pass } = await req.json()
        if (!userName || !pass || userName?.length == 0 || pass?.length == 0) throw new Error("something is wrong");
        await connectDb()
        const admin = await Admin.findOne({ userName: userName })
        if (!admin) return NextResponse.json({ success: false, error: "Wrong credentials" })
        const checkPass = await CheckHashPass(pass, admin.pass)
        if (checkPass != true) return NextResponse.json({ success: false, error: "Wrong credentials" })

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
        console.log(error.message)
        return NextResponse.json({ success: false, error: `Server error, contact:${process.env.NEXT_PUBLIC_EMAIl}` })
    }
}