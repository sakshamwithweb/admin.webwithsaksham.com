import { Question } from "@/lib/models/question";
import connectDb from "@/lib/mongoose";
import { NextResponse } from "next/server";


export async function POST(params) {
    try {
        const { question } = await params.json();
        await connectDb()
        const newQ = new Question({
            question: question
        })
        await newQ.save()
        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message })
    }
}