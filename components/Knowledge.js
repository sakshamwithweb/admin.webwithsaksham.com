import React from 'react'
import { Progress } from "@/components/ui/progress"

const Knowledge = ({knowledge}) => {
    return (
        <div id='knowledge' className='flex flex-col justify-center items-center border-b'>
            <h1 className='text-3xl font-bold underline'>Knowledge</h1>
            <div className='my-24 grid grid-cols-1 md:grid-cols-2 md:gap-16 gap-6'>
                {knowledge.map((i,index) => {
                    return (
                        <div className='md:w-80 w-64' key={index}>
                            <strong>{i.skill}</strong>
                            <Progress value={i.percentage} />
                        </div>
                    )
                })}
            </div>
        </div>
    )
    
}

export default Knowledge