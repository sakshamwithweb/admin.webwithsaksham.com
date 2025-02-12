"use client"
import { useToast } from '@/hooks/use-toast'
import { CircleX, Edit } from 'lucide-react'
import dynamic from 'next/dynamic'
import React, { useEffect, useState } from 'react'

const Dashboard = () => {
  const [edit, setEdit] = useState({ mode: false, editTo: "" })
  const [data, setData] = useState(null)
  const [sections] = useState(["about", "knowledge", "project"])
  const { toast } = useToast()

  useEffect(() => {
    (async () => {
      try {
        const req = await fetch(`/api/fetchAdminDetails`, {
          method: "POST",
          headers: {
            "Content-Type": "applicaion/json"
          },
          body: JSON.stringify({})
        })
        const res = await req.json()
        setData(res.data)
        return
      } catch (error) {
        toast({
          title: "❌ Something Went Wrong",
          description: `Write your issue in footer!`,
      })
      }
    })()
  }, [])

  if (!data) {
    return <p className='text-center'>Loading..</p>
  }

  return (
    <div className='min-h-screen flex flex-col'>
      {sections.map((section, index) => {
        let compName = section.charAt(0).toUpperCase() + section.slice(1).toLowerCase()

        if (edit?.mode && edit?.editTo == section) {// Selected to edit
          const SectionEditComponent = dynamic(() => import(`@/components/edit/${compName}.js`), { ssr: false });
          return (
            <section key={index} className='flex-1 relative flex flex-col items-center justify-center border-b'>
              <button className='absolute top-1 right-1' onClick={() => { setEdit({ mode: false, editTo: "" }) }}><CircleX /></button> {/*If it is clicked ad something is vhanged so firstly ask do you want to save what you written , give 2 button save and No*/}
              <SectionEditComponent {...{ [section]: data[section] }} />
            </section>
          )
        } else { // ordinary component
          const SectionComponent = dynamic(() => import(`@/components/${compName}.js`), { ssr: false });

          return (
            <section key={index} className='flex-1 relative flex flex-col items-center justify-center border-b'>
              <button className='absolute top-1 right-1' onClick={() => { setEdit({ mode: true, editTo: section }) }}><Edit /></button>
              <SectionComponent {...{ [section]: data[section] }} />
            </section>
          )
        }
      })}
    </div>
  )
}

export default Dashboard