import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const About = ({about}) => {
    return (
        <div id='about' className='flex flex-col justify-center items-center border-b'>
            <h1 className='text-3xl font-bold underline'>About</h1>
            <div className='my-9'>
                <Avatar>
                    <AvatarImage src="/image.png" alt="avatar" />
                    <AvatarFallback>Saksham</AvatarFallback>
                </Avatar>
            </div>
            <div className='mb-9'>
                <ul>
                    {Object.entries(about).map(([key, value], index) => (
                        <li key={index} className='text-xl'>
                            <strong>{key}:</strong> {value}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

export default About