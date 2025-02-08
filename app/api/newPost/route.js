import { Post } from "@/lib/models/post"
import connectDb from "@/lib/mongoose"
import { NextResponse } from "next/server"
import uuid4 from "uuid4"

export async function POST(req) {
    try {
        const { title, content, publishedTime, categoryValue } = await req.json()
        await connectDb()
        const id = uuid4()
        const post = new Post({
            title: title,
            content: content,
            publishedTime: publishedTime,
            id: id,
            categoryValue:categoryValue
        })
        await post.save()
        return NextResponse.json({ success: true, id: id })
    } catch (error) {
        return NextResponse.json({ succss: false })
    }
}