import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import { Trash } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import DOMPurify from "isomorphic-dompurify";
import { Loader } from '../Loader'
import { getStatusMessage } from '@/lib/statusMessage'
import { generateToken } from '@/lib/generateToken'

const Project = ({ project }) => {
    const [changedData, setChangedData] = useState(null)
    const { toast } = useToast()
    const [wait, setWait] = useState(false)

    useEffect(() => {
        setChangedData(project)
    }, [])

    const handleSubmit = async (e) => {
        try {
            e.preventDefault()
            if (changedData === project) {
                toast({
                    title: "❌ Nothing has been changed.",
                    description: "Please either cancel editing or change something.",
                })
                return;
            }
            setWait(true)
            const sanitizedData = changedData.map((item) => {
                return Object.fromEntries(Object.entries(item).map(([key, value]) => {
                    return [key, DOMPurify.sanitize(value)];
                }));
            })
            const { token, id } = await generateToken()
            const req = await fetch(`/api/adminDetails`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ changedData: sanitizedData, section: "project", id })
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
            return;
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
        <div id='projects' className='border-b'>
            <h1 className='text-3xl font-bold underline text-center'>Projects</h1>
            <form className='flex flex-col gap-8 m-5'>
                {changedData.map((items, index) => {
                    return (
                        <div className='flex gap-4' key={index}>
                            <Input className='md:w-40 sm:w-40 sm:focus:w-40 md:focus:w-40 focus:w-20 w-10' onChange={(e) => {
                                setChangedData((prev) =>
                                    prev.map((item, idx) =>
                                        idx === index ? { ...item, title: e.target.value } : item
                                    )
                                )
                            }} value={items.title} />
                            <Input className='md:w-40 sm:focus:w-40 md:focus:w-40 focus:w-20 w-10 sm:w-40' onChange={(e) => {
                                setChangedData((prev) =>
                                    prev.map((item, idx) =>
                                        idx === index ? { ...item, Made_With: e.target.value } : item
                                    )
                                )
                            }} value={items.Made_With} />
                            <Input className='md:w-40 sm:focus:w-40 md:focus:w-40 focus:w-20 w-10 sm:w-40' onChange={(e) => {
                                setChangedData((prev) =>
                                    prev.map((item, idx) =>
                                        idx === index ? { ...item, Repositry: e.target.value } : item
                                    )
                                )
                            }} value={items.Repositry} />
                            <Input className='md:w-40 sm:focus:w-40 md:focus:w-40 focus:w-20 w-10 sm:w-40' onChange={(e) => {
                                setChangedData((prev) =>
                                    prev.map((item, idx) =>
                                        idx === index ? { ...item, Description: e.target.value } : item
                                    )
                                )
                            }} value={items.Description} />
                            <Button onClick={(e) => {
                                e.preventDefault()
                                setChangedData([...changedData.slice(0, index), ...changedData.slice(index + 1)])
                            }}><Trash /></Button>
                        </div>
                    )
                })}
                <div className='flex gap-4 justify-center items-center'>
                    <Button onClick={(e) => {
                        e.preventDefault()
                        setChangedData([...changedData, { "title": "Project Name", "Made_With": "Technology used", "Repositry": "https://github.com/sakshamwithweb", "Description": "Sample Project" }])
                    }}>Add More</Button>
                    <Button disabled={wait} onClick={handleSubmit}>Save</Button>
                </div>
            </form>
        </div>
    )
}

export default Project