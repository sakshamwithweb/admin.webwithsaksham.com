"use client"
import React, { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import DOMPurify from "isomorphic-dompurify";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { getStatusMessage } from '@/lib/statusMessage'
import { generateToken } from '@/lib/generateToken'

const Footer = () => {
    const [question, setQuestion] = useState("")
    const [busy, setBusy] = useState(false)
    const { toast } = useToast()

    const sendQuestion = async () => {
        try {
            const sanitizedQuestion = DOMPurify.sanitize(question);
            const { token, id } = await generateToken()
            const req1 = await fetch("/api/question", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ question: sanitizedQuestion, id })
            })
            if (!req1.ok) {
                const statusText = await getStatusMessage(req1.status)
                throw new Error(`Error ${req1.status}: ${statusText}`);
            }
            const res1 = await req1.json()
            if (res1.success) {
                toast({
                    title: "✅ Sent Successfully",
                    description: "Your message will be read by us.",
                })
            } else {
                throw new Error("Unable to send Question!");
            }
        } catch (error) {
            toast({
                title: `❌ ${error.message}`,
                description: `Write your issue in footer!`,
            })
        }
    }

    const handleSubmit = async () => {
        if (question.trim() == 0) {
            toast({
                title: "✍️ All fields are mandatory",
                description: `Please complete all field..`,
            })
            return
        }
        setBusy(true)
        await sendQuestion()
        setBusy(false)
        setQuestion("")
    }
    return (
        <footer className=''>
            <div className='flex w-full h-48'>
                <div className='md:w-1/2 w-1/3 flex flex-col justify-center items-center'>
                    <h1 className='text-2xl hidden md:block'>Connect with me:</h1>
                    <div className='flex flex-col gap-1 items-center'>
                        <a target='_blank' href='https://github.com/sakshamwithweb' data-tooltip-content="GitHub">
                            <img src='/github.png' alt="github" className='h-10' />
                        </a>
                        <a href='https://www.linkedin.com/in/gourav-krishn-goswami' target='_blank' data-tooltip-content="LinkedIn">
                            <img src='/linkedin.png' alt="linkedin" className='h-10' />
                        </a>
                        <a href='mailto:contact@webwithsaksham.com' target='_blank' data-tooltip-content="Email">
                            <img src='/mail.png' alt="mail" className='h-10' />
                        </a>
                    </div>
                </div>
                <div className='w-1/2 flex flex-col justify-center items-center'>
                    <h1 className='text-xl mb-5'>Ask or give feedback</h1>
                    <div className="flex w-full max-w-sm items-center space-x-2">
                        <Input type="text" value={question} onChange={(e) => { setQuestion(e.target.value) }} placeholder="Enter here" />
                        <Button aria-label="Send" onClick={handleSubmit} className={`${busy ? "bg-[rgba(147,51,234,calc(var(--tw-text-opacity,1)*0.5))]" : ""}`} disabled={busy}>Send</Button>
                    </div>
                </div>
            </div>
            <div className='flex justify-center items-center'><span>Copyright &copy;{new Date().getFullYear()} All rights reserved&nbsp;</span><span className='hidden md:block'>| Made by Saksham Goswami.</span></div>

            <ReactTooltip anchorSelect="[data-tooltip-content]" />
        </footer>
    )
}

export default Footer