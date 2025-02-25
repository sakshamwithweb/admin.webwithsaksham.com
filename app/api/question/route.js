import { Question } from "@/lib/models/question";
import connectDb from "@/lib/mongoose";
import { NextResponse } from "next/server";
import DOMPurify from "isomorphic-dompurify";

//get questions
export async function GET() {
    try {
        await connectDb();
        const question = await Question.find({ resolves: false })
        if (!question) return NextResponse.json({ success: false, message: "Question not found" }, { status: 404 })
        return NextResponse.json({ success: true, data: question })
    } catch (error) {
        return NextResponse.json({ success: false, message: "Unable to fetch qustions" }, { status: 500 })
    }
}

// new question
export async function POST(params) {
    try {
        const { question } = await params.json();
        const sanitizedQuestion = DOMPurify.sanitize(question);
        if (!sanitizedQuestion || sanitizedQuestion?.length == 0) return NextResponse.json({ success: false, message: "Invalid payload" }, { status: 422 })
        await connectDb()
        const newQ = new Question({
            question: sanitizedQuestion
        })
        await newQ.save()
        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json({ success: false, message: "Unable to post question" }, { status: 500 })
    }
}

// resolving question
export async function PUT(req) {
    try {
        const { changedQueries } = await req.json()
        if (!changedQueries || changedQueries?.length == 0) return NextResponse.json({ success: false, message: "Invalid payload" }, { status: 422 })
        await connectDb()
        for (const i of changedQueries) {
            await Question.findOneAndUpdate({ _id: i }, { resolves: true })
        }
        return NextResponse.json({ success: true })
    } catch (err) {
        return NextResponse.json({ success: false, message: "Unable to resolve question" }, { status: 500 })
    }
}