import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { useToast } from '@/hooks/use-toast'
import React, { useEffect, useState } from 'react'

const Queries = () => {
  const [queries, setQueries] = useState(null)
  const [changedData, setChangedData] = useState(null)
  const [wait,setWait] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    (async () => {
      try {
        const req = await fetch(`/api/fetchQuestions`, {
          method: "POST",
          headers: {
            "Content-Type": "applicaion/json"
          },
          body: JSON.stringify({})
        })
        const res = await req.json()
        if (res.success) {
          setQueries(res.data)
          setChangedData(res.data)
        } else {
          toast({
            title: "❌ Something Went Wrong, Unable to fetch!",
            description: `Write your issue in footer!`,
        })
        }
      } catch (error) {
        toast({
          title: "❌ Something Went Wrong",
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
      const req = await fetch(`/api/resolveQuestions`, {
        method: "POST",
        headers: {
          "Content-Type": "applicaion/json"
        },
        body: JSON.stringify({ changedQueries: changedQueries })
      })
      const res = await req.json()
      if (res.success) {
        setWait(false)
        window.location.reload()
      } else {
        setWait(false)
        toast({
          title: "❌ Nothing has been changed",
          description: "Server Error!",
        })
      }
    } catch (error) {
      toast({
        title: "❌ Something Went Wrong",
        description: `Write your issue in footer!`,
    })
    }
  }

  if (!changedData) {
    return (
      <div className='text-center text-xl m-4'>Loading...</div>
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
              <Checkbox value={item.resolves} onCheckedChange={(checked) => setChangedData((prev) =>
                prev.map((items, idx) =>
                  idx === index ? { ...items, resolves: checked } : items
                )
              )} />
            </div>
          </div>
        )
      })}
      <Button disabled={wait} onClick={handleClick}>Save</Button>
    </div>
  )
}

export default Queries