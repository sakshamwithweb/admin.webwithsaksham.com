"use client"
import { useToast } from '@/hooks/use-toast'
import { CircleX, Edit } from 'lucide-react'
import dynamic from 'next/dynamic'
import React, { useEffect, useState } from 'react'
import { Tooltip as ReactTooltip } from "react-tooltip";
import { Loader } from '../Loader'
import { getStatusMessage } from '@/lib/statusMessage'

const Dashboard = () => {
  const [edit, setEdit] = useState({ mode: false, editTo: "" })
  const [data, setData] = useState(null)
  const [sections] = useState(["about", "knowledge", "project"])
  const { toast } = useToast()
  const [tooltipKey, setTooltipKey] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        const req = await fetch(`/api/adminDetails`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({})
        })
        if (!req.ok) {
          const statusText = await getStatusMessage(req.status)
          throw new Error(`Error ${req.status}: ${statusText}`);
        }
        const res = await req.json()
        if (res.success) {
          setData(res.data)
        } else {
          throw new Error("Error while fetching details!");
        }
      } catch (error) {
        toast({
          title: `❌ ${error.message}`,
          description: `Write your issue in footer!`,
        })
      }
    })()
  }, [])

  useEffect(() => {
    setTooltipKey((prevKey) => prevKey + 1); // React uses the 'key' props to track any element in DOM and if 'key' is changed so the react treat that element as new and refresh it so the problem was that the tooltip was unable to identify any changes in dom which led to keep the tooltip but now it is refreshing and will have to make new one. The tooltip key will keep increasing..
  }, [edit]);

  if (!data) {
    return <Loader />
  }

  return (
    <div className='min-h-screen flex flex-col'>
      {sections.map((section, index) => {
        let compName = section.charAt(0).toUpperCase() + section.slice(1).toLowerCase()

        if (edit?.mode && edit?.editTo == section) {// Selected to edit
          const SectionEditComponent = dynamic(() => import(`@/components/edit/${compName}.js`), { ssr: false });
          return (
            <section key={index} className='flex-1 relative flex flex-col items-center justify-center border-b'>
              <ReactTooltip
                key={tooltipKey + 1}
                id={`close-${index}`}
                content="Close the editor"
              />
              <button className='absolute top-1 right-1' onClick={() => { setEdit({ mode: false, editTo: "" }) }} data-tooltip-id={`close-${index}`}><CircleX /></button>
              <SectionEditComponent {...{ [section]: data[section] }} />
            </section>
          )
        } else { // ordinary component
          const SectionComponent = dynamic(() => import(`@/components/${compName}.js`), { ssr: false });

          return (
            <section key={index} className='flex-1 relative flex flex-col items-center justify-center border-b'>
              <ReactTooltip
                key={tooltipKey}
                id={`edit-${index}`}
                content="Edit the section"
              />
              <button className='absolute top-1 right-1' onClick={() => { setEdit({ mode: true, editTo: section }) }} data-tooltip-id={`edit-${index}`}><Edit /></button>
              <SectionComponent {...{ [section]: data[section] }} />
            </section>
          )
        }
      })}
    </div>
  )
}

export default Dashboard