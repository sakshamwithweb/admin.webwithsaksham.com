import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import React, { useEffect, useState } from 'react'

const About = ({ about }) => {
    const [changedData, setChangedData] = useState(null)
    const { toast } = useToast()
    const [wait, setWait] = useState(false)

    useEffect(() => {
        setChangedData(about)
    }, [])

    const handleSubmit = async (e) => {
        try {
            e.preventDefault()
            if (changedData === about) {
                toast({
                    title: "❌ Nothing has been changed.",
                    description: "Please either cancel editing or change something.",
                })
                return;
            }
            setWait(true)
            const req = await fetch(`/api/changeAdminDetails`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ changedData, section: "about" })
            })
            if (!req.ok) {
                throw new Error("Error while changing Admin details!");
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
        return <p className='m-2 text-center'>Loading...</p>
    }

    return (
        <div id='about' className='flex flex-col justify-center items-center border-b'>
            <h1 className='text-3xl font-bold underline'>About</h1>
            <div className='m-9'>
                <form className='flex flex-col gap-5'>
                    {Object.entries(changedData).map(([key, value], index) => (
                        <div key={index} className='text-xl flex '>
                            <strong>{key}:</strong>
                            <Input value={value} onChange={(e) => setChangedData((prev) => ({ ...prev, [key]: e.target.value, }))} />
                        </div>
                    ))}
                    <Button disabled={wait} onClick={handleSubmit}>Save</Button>
                </form>
            </div>
        </div>
    )
}

export default About