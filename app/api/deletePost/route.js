import { Post } from "@/lib/models/post"
import connectDb from "@/lib/mongoose"
import { NextResponse } from "next/server"

export async function POST(req) {
    try {
        const { id } = await req.json()
        if (!id || id?.length == 0) throw new Error("something is wrong");
        await connectDb()
        await Post.deleteOne({ id: id })
        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json({ success: false })
    }
}