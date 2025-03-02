import React, { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { Trash } from 'lucide-react'
import DOMPurify from "isomorphic-dompurify";
import { Loader } from '../Loader'
import { getStatusMessage } from '@/lib/statusMessage'
import { generateToken } from '@/lib/generateToken'

const Knowledge = ({ knowledge }) => {
    const [changedData, setChangedData] = useState(null)
    const [wait, setWait] = useState(false)
    const { toast } = useToast()

    useEffect(() => {
        setChangedData(knowledge)
    }, [])

    const handleSubmit = async (e) => {
        try {
            e.preventDefault()
            if (changedData === knowledge) {
                toast({
                    title: "❌ Nothing has been changed.",
                    description: "Please either cancel editing or change something.",
                })
                return;
            }
            setWait(true)
            let sanitizedData = changedData.map((item) => {
                return Object.fromEntries(Object.entries(item).map(([key, value]) => {
                    return [key, value != 0 ? DOMPurify.sanitize(value) : value]; // if value is number as 0 so don't change or else purify
                }));
            })
            const { token, id } = await generateToken()
            const req = await fetch(`/api/adminDetails`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ changedData: sanitizedData, section: "knowledge", id })
            })
            if (!req.ok) {
                const statusText = await getStatusMessage(req.status)
                throw new Error(`Error ${req.status}: ${statusText}`);
            }
            const res = await req.json()
            setWait(false)
            if (res.success) {
                toast({
                    title: "✔️ Successfully changed",
                    description: "Your changed data is updated in database",
                })
                window.location.reload()
            } else {
                throw new Error("Error while changing Admin details!");
            }
        } catch (error) {
            toast({
                title: `❌ ${error.message}`,
                description: `Write your issue in footer!`,
            })
        }
    }

    if (!changedData) {
        return <Loader />
    }

    return (
        <div id='knowledge' className='flex flex-col justify-center items-center border-b'>
            <h1 className='text-3xl font-bold underline'>Knowledge</h1>
            <form className='flex flex-col justify-center items-center'>
                <div className='flex flex-col gap-5 m-4'>
                    {changedData.map((i, index) => (
                        <div className='md:w-80 w-64 flex gap-5' key={index}>
                            <Input
                                onChange={(e) => {
                                    setChangedData((prev) =>
                                        prev.map((item, idx) =>
                                            idx === index ? { ...item, skill: e.target.value } : item
                                        )
                                    );
                                }}
                                value={i.skill}
                            />

                            <Input
                                onChange={(e) => {
                                    setChangedData((prev) =>
                                        prev.map((item, idx) =>
                                            idx === index ? { ...item, percentage: e.target.value } : item
                                        )
                                    );
                                }}
                                value={i.percentage}
                            />
                            <Button onClick={(e) => {
                                e.preventDefault()
                                setChangedData([...changedData.slice(0, index), ...changedData.slice(index + 1)])
                            }}><Trash /></Button>
                        </div>
                    ))}
                </div>
                <div className='flex gap-4 m-2'>
                    <Button onClick={(e) => {
                        e.preventDefault()
                        setChangedData([...changedData, { "skill": "SkillName", "percentage": 0 }])
                    }}>Add More</Button>
                    <Button disabled={wait} onClick={handleSubmit}>Save</Button>
                </div>
            </form>
        </div>
    )
}

export default Knowledge