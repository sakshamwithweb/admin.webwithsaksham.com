import { Post } from "@/lib/models/post";
import connectDb from "@/lib/mongoose";
import { NextResponse } from "next/server";


export async function POST() {
    try {
        await connectDb()
        const allPosts = await Post.find({})
        let arr = [];
        allPosts.map((i) => { arr.push(i.categoryValue) })
        const removeDuplicates = (arr) => [...new Set(arr)];
        return NextResponse.json({ success: true, data: (removeDuplicates(arr)) })
    } catch (error) {
        return NextResponse.json({ success: false })
    }
}