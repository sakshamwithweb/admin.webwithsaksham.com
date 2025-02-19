"use client"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from "@/components/ui/label"
import React, { useEffect, useState } from 'react'
import { useToast } from "@/hooks/use-toast"
import { notFound, useRouter } from 'next/navigation'
import DOMPurify from "isomorphic-dompurify";

const page = () => {
    const [userName, setUserName] = useState("")
    const [pass, setPass] = useState("")
    const [wait, setWait] = useState(false)
    const { toast } = useToast()
    const router = useRouter()

    useEffect(() => {
        (async () => {
            try {
                const req = await fetch("/api/checkSession", {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({})
                })
                if (!req.ok) {
                    throw new Error(`Error ${req.status}: ${req.statusText}`);
                }
                const res = await req.json()
                if (res.success) {
                    router.push("/dashboard")
                    toast({
                        title: "🙀 You are already logged in",
                        description: "Couldn't register anymore"
                    })
                }
            } catch (error) {
                toast({
                    title: `❌ ${error.message}`,
                    description: `Write your issue in footer!`,
                })
                notFound()
            }
        })()
    }, [])

    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            setWait(true)
            if (userName.length == 0 || pass.length == 0) {
                toast({
                    title: "🙀 All table is mandatory",
                    description: "Please fill all the fields.",
                })
                setWait(false)
                return
            }
            const sanitizedUserName = DOMPurify.sanitize(userName);
            const sanitizedPass = DOMPurify.sanitize(pass);
            const req1 = await fetch(`/api/adminLogin`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ userName: sanitizedUserName, pass: sanitizedPass })
            })
            if (!req1.ok) {
                throw new Error(`Error ${req1.status}: ${req1.statusText}`);
            }
            const res1 = await req1.json()
            if (res1.success) {
                toast({
                    title: "✅ You are logged in here.",
                    description: "In rest you are out.",
                })
                router.push("/dashboard")
            } else {
                throw new Error("Error while logging admin!");
            }
            setWait(false)
            setUserName("")
            setPass("")
        } catch (error) {
            toast({
                title: `❌ ${error.message}`,
                description: `Write your issue in footer!`,
            })
        }
    }

    return (
        <div className='min-h-screen border-b flex justify-center items-center'>
            <form className='flex flex-col border rounded-xl p-10 items-center'>
                <div>
                    <h1 className='text-2xl m-3 font-bold'>Admin Login</h1>
                </div>
                <div className='flex flex-col gap-5'>
                    <div>
                        <Label htmlFor="username">Username</Label>
                        <Input type="text" value={userName} onChange={(e) => { setUserName(e.target.value) }} name="username" id="username" placeholder="Enter Username" />
                    </div>
                    <div>
                        <Label htmlFor="password">Password</Label>
                        <Input type="password" value={pass} onChange={(e) => { setPass(e.target.value) }} name="password" id="password" placeholder="Enter Password" />
                    </div>
                    <Button disabled={wait} onClick={handleSubmit} aria-label="Submit">Submit</Button>
                </div>
            </form>
        </div>
    )
}

export default page