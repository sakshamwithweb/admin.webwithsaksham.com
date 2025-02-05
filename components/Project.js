import React from 'react'

const Project = ({project}) => {
    return (
        <div id='projects' className='flex flex-col items-center justify-center border-b'>
            <h1 className='text-3xl font-bold underline'>Projects</h1>
            <div className='cards my-24 grid grid-cols-1 md:grid-cols-2 md:gap-10 gap-5'>
                {project.map((items, index) => {
                    return (
                        <a href={items.Repositry} target='_blank' className='rounded-xl flex flex-col border md:max-w-40vw max-w-80vw overflow-auto' key={index}>
                            <h1 className='text-2xl font-bold text-center p-5'>{items.title}</h1>
                            <span className='text-center text-xl whitespace-nowrap'>{items.Description} Made using {items.Made_With}</span>
                        </a>
                    )
                })}
            </div>
        </div>
    )
}

export default Project