import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import MDEditor from '@uiw/react-md-editor';
import { Play } from 'lucide-react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'

const AdminBlogsNew = () => {
  const { theme } = useTheme();
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("**Lets Begin!!!**");
  const [id, setId] = useState(null)
  const { toast } = useToast()

  const handleSubmit = async () => {
    console.log({ title, content })
    const publishedTime = new Date().toISOString()
    const req = await fetch(`/api/newPost`, {
      method: "POST",
      headers: {
        "Content-Type": "applicaion/json"
      },
      body: JSON.stringify({ title, content, publishedTime })
    })
    const res = await req.json()
    if (res.success && res.id) {
      setId(res.id)
      console.log(res.id)
      toast({
        title: "✅ Successfully Posted!!",
        description: "You will get your id.",
      })
    } else {
      toast({
        title: "❌ Something went wrong",
        description: "Server error.",
      })
    }
  }

  if (id) {
    return(
      <div className='min-h-screen flex flex-col justify-center items-center'>
        <div className='flex flex-col justify-center items-center gap-5'>
          <h1 className='text-4xl'>✔️</h1>
          <h2>Your post has been posted successfully🥳.</h2>
          <div>
            <strong>ID:</strong>
            <span>&nbsp;{id}</span>
          </div>
          <Link className='border p-2 rounded-3xl bg-purple-800 text-white' href={"/dashboard"}>Back to Dashboard</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col gap-5 mx-4 border-b relative">
      <h1 className='text-center text-2xl font-bold'>New Blog</h1>

      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="title">Title</Label>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} type="title" id="title" placeholder="Title" />
      </div>

      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="content">Content</Label>
        <MDEditor
          id="content"
          height="70vh"
          data-color-mode={theme}
          value={content}
          onChange={setContent}
        />
      </div>

      <Button onClick={handleSubmit} className="mx-auto w-11/12">Post</Button>

      <Button className="absolute top-1 right-1"><Play /></Button> {/*Work on it*/}
    </div>
  );
}

export default AdminBlogsNew