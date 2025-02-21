import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { useToast } from '@/hooks/use-toast'
import { EllipsisVertical, Link2Icon, Plus, Trash } from 'lucide-react'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { Tooltip as ReactTooltip } from "react-tooltip";

const Blogs = () => {
  const [blogsData, setBlogsData] = useState(null)
  const [wait, setWait] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    (async () => {
      try {
        const req = await fetch(`/api/post`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          }
        })
        if (!req.ok) {
          throw new Error(`Error ${req.status}: ${req.statusText}`);
        }
        const res = await req.json()
        if (res.success) {
          setBlogsData(res.data)
        } else {
          throw new Error("Error while fetching Blogs!");
        }
      } catch (error) {
        toast({
          title: `❌ ${error.message}`,
          description: `Write your issue in footer!`,
        })
      }
    })()
  }, [])

  const handledeletePost = async (_id) => {
    try {
      if (!wait) {
        setWait(true)
        const req = await fetch(`/api/post`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ _id: _id })
        })
        if (!req.ok) {
          throw new Error(`Error ${req.status}: ${req.statusText}`);
        }
        const res = await req.json()
        setWait(false)
        if (res.success) {
          toast({ title: `✅ Post Deleted` });
          window.location.reload()
        } else {
          throw new Error("Error while deleting post!");
        }
      }
    } catch (error) {
      toast({
        title: `❌ ${error.message}`,
        description: `Write your issue in footer!`,
      })
    }
  }

  if (!blogsData) {
    return <p className='m-2 text-center'>Loading...</p>
  } else if (blogsData.length == 0) {
    return (
      <div className='flex justify-center items-center gap-5'>
        <p className='m-2 text-center'>No Post is there</p>
        <Link data-tooltip-content="New Blog!" href={"/blogs/new"}><Button><Plus /></Button></Link>
        <ReactTooltip anchorSelect="[data-tooltip-content]" />
      </div>
    )
  }

  return (
    <div className='relative min-h-screen'>
      <Link data-tooltip-content="New Blog!" className='absolute top-0 right-1' href={"/blogs/new"}><Button><Plus /></Button></Link>
      <h1 className='text-xl text-center font-bold'>Your Blogs</h1>
      <div className='flex flex-col gap-6 py-10 w-full items-center'>
        {blogsData.map((item, index) => {
          return (
            <div className='border h-16 relative w-11/12 rounded-2xl flex justify-between items-center' key={index}>
              <div className='overflow-auto h-full md:mr-2 md:ml-2 mr-10 ml-2 scrollbar-thin border-r w-[95%] flex text-lg items-center'>
                <Link href={`https://blog.webwithsaksham.com/${item._id}`} className='mx-2 whitespace-nowrap'>{item.title}</Link>
              </div>
              <div className='absolute top-4 right-2'>
                <DropdownMenu>
                  <DropdownMenuTrigger data-tooltip-content="Menu"><EllipsisVertical /></DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => {
                      navigator.clipboard.writeText(`https://blog.webwithsaksham.com/${item._id}`).then(() => {
                        toast({ title: `✅ Copied` });
                      })
                        .catch(() => {
                          toast({
                            title: "❌ Something Went Wrong",
                            description: `Write your issue in footer!`,
                          })
                        });
                    }}>Save Link<Link2Icon /></DropdownMenuItem>
                    <DropdownMenuItem onClick={() => { handledeletePost(item._id) }}>Delete Post<Trash /></DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          )
        })}
      </div>
      <ReactTooltip anchorSelect="[data-tooltip-content]" />
    </div>
  )
}

export default Blogs