import { Question } from "@/lib/models/question";
import connectDb from "@/lib/mongoose";
import { NextResponse } from "next/server";

export async function POST() {
    try {
        await connectDb();
        const question = await Question.find({ resolves: false })
        if (!question) return NextResponse.json({ success: false })
        return NextResponse.json({ success: true, data: question })
    } catch (error) {
        return NextResponse.json({ success: false })
    }
}