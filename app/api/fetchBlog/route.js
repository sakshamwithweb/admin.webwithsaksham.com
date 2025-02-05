import { Post } from "@/lib/models/post";
import connectDb from "@/lib/mongoose";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        await connectDb()
        const posts = await Post.find({})
        if (!posts) return NextResponse.json({ success: false })
        return NextResponse.json({ success: true, data: posts })
    } catch (error) {
        return NextResponse.json({ success: false })
    }
}