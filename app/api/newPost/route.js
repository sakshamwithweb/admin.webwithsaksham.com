import { Post } from "@/lib/models/post"
import { SubscribeEmail } from "@/lib/models/subscribeEmail"
import connectDb from "@/lib/mongoose"
import { NextResponse } from "next/server"
import nodemailer from "nodemailer";
import uuid4 from "uuid4"

export async function POST(req) {
    try {
        const { title, content, publishedTime, categoryValue } = await req.json()
        if (!title || !content || !publishedTime || !categoryValue || title?.length == 0 || content?.length == 0 || publishedTime?.length == 0 || categoryValue?.length == 0) throw new Error("something is wrong");
        await connectDb()
        const id = uuid4()
        const post = new Post({
            title: title,
            content: content,
            publishedTime: publishedTime,
            id: id,
            categoryValue: categoryValue
        })
        await post.save()

        const emailsDb = await SubscribeEmail.find({})
        const emails = emailsDb.flatMap(i => i.email);

        if (emails.length !== 0) {
            const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: process.env.GMAIL,
                    pass: process.env.GMAIL_PASS,
                },
            });

            for (const email of emails) {
                await transporter.sendMail({
                    from: process.env.GMAIL,
                    to: email,
                    subject: `👀 Check out Saksham’s latest post`,
                    headers: {
                        "List-Unsubscribe": `<https://blog.webwithsaksham.com/unsubscribe?gmail=${email}>`
                    },
                    html: `
                        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border-radius: 10px; background-color: #f9f9f9; color: #333;">
                            <h2 style="color: #0073e6; text-align: center;">🚀 New Post Alert!</h2>
                            <p>Hey,</p>
                            <p>A new post has just been published by <strong>SakshamWithWeb</strong>.</p>
                            <div style="background-color: #fff; padding: 15px; border-radius: 8px; box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1);">
                                <h3 style="color: #333;">${title}</h3>
                                <p style="font-size: 14px; color: #666;"><strong>Category:</strong> ${categoryValue}</p>
                            </div>
                            <p style="text-align: center; margin-top: 20px;">
                                <a href="https://blog.webwithsaksham.com/${id}" 
                                   style="display: inline-block; padding: 10px 20px; font-size: 16px; background-color: #0073e6; color: #fff; text-decoration: none; border-radius: 5px;">
                                    🔗 Read Now
                                </a>
                            </p>
                            <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
                            <p style="font-size: 12px; text-align: center; color: #888;">
                                If you no longer wish to receive these emails, you can 
                                <a href="https://blog.webwithsaksham.com/unsubscribe?emailId=${email}" style="color: #0073e6;">unsubscribe here</a>.
                            </p>
                        </div>
                    `
                });
            }
        }

        return NextResponse.json({ success: true, id: id })
    } catch (error) {
        return NextResponse.json({ success: false })
    }
}