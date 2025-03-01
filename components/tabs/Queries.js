import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { useToast } from '@/hooks/use-toast'
import React, { useEffect, useState } from 'react'
import { Tooltip as ReactTooltip } from "react-tooltip";
import { Loader } from '../Loader';
import { getStatusMessage } from '@/lib/statusMessage';
import { generateToken } from '@/lib/generateToken';

const Queries = () => {
  const [queries, setQueries] = useState(null)
  const [changedData, setChangedData] = useState(null)
  const [wait, setWait] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    (async () => {
      try {
        const { token, id } = await generateToken()
        const req = await fetch(`/api/question?id=${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`
          },
        })
        if (!req.ok) {
          const statusText = await getStatusMessage(req.status)
          throw new Error(`Error ${req.status}: ${statusText}`);
        }
        const res = await req.json()
        if (res.success) {
          setQueries(res.data)
          setChangedData(res.data)
        } else {
          throw new Error("Unable to fetch Questions!");
        }
      } catch (error) {
        toast({
          title: `❌ ${error.message}`,
          description: `Write your issue in footer!`,
        })
      }
    })()
  }, [])

  const handleClick = async () => {
    try {
      if (changedData == queries) {
        toast({
          title: "❌ Nothing has been changed",
          description: "Please make any changes.",
        })
        return;
      }
      setWait(true)
      let changedQueries = [];
      changedData.map((item, index) => {
        item != queries[index] && changedQueries.push(item._id)
      })
      const { token, id } = await generateToken()
      const req = await fetch(`/api/question`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ changedQueries: changedQueries, id })
      })
      const res = await req.json()
      setWait(false)
      if (res.success) {
        window.location.reload()
      } else {
        throw new Error("Unable to change!");
      }
    } catch (error) {
      toast({
        title: `❌ ${error.message}`,
        description: `Write your issue in footer!`,
      })
    }
  }

  if (!changedData) {
    return (
      <Loader />
    )
  } else if (changedData?.length == 0) {
    return (
      <div className='text-center text-xl m-4'>No Query is there</div>
    )
  }

  return (
    <div className='flex flex-col gap-5 items-center m-5'>
      {changedData.map((item, index) => {
        return (
          <div className='flex gap-4 justify-center items-center border h-20 md:w-3/4 w-full ' key={index}>
            <div className='overflow-auto border w-11/12 text-lg flex  items-center h-full'>
              <h2 className='whitespace-nowrap'>{item.question}</h2>
            </div>
            <div className=''>
              <Checkbox data-tooltip-content="Select which you have to resolve" value={item.resolves} onCheckedChange={(checked) => setChangedData((prev) =>
                prev.map((items, idx) =>
                  idx === index ? { ...items, resolves: checked } : items
                )
              )} />
            </div>
          </div>
        )
      })}
      <Button disabled={wait} onClick={handleClick}>Save</Button>
      <ReactTooltip anchorSelect="[data-tooltip-content]" />
    </div>
  )
}

export default Queries