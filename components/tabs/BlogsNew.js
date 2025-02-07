import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import MDEditor from '@uiw/react-md-editor';
import { CircleX, Play } from 'lucide-react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import rehypeDocument from 'rehype-document'
import rehypeFormat from 'rehype-format'
import rehypeStringify from 'rehype-stringify'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import { unified } from 'unified'
import rehypePrettyCode from "rehype-pretty-code";
import { transformerCopyButton } from '@rehype-pretty/transformers'

const AdminBlogsNew = () => {
  const { theme } = useTheme();
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("**Lets Begin!!!**");
  const [id, setId] = useState(null)
  const [htmlContent, setHtmlContent] = useState("")
  const [review, setReview] = useState(false)
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

  useEffect(() => {
    if (content && review) {
      const processData = async () => {
        const processor = unified()
          .use(remarkParse)
          .use(remarkRehype)
          .use(rehypeDocument, { title: '👋🌍' })
          .use(rehypeFormat)
          .use(rehypeStringify)
          .use(rehypePrettyCode, {
            theme: "github-dark",
            transformers: [
              transformerCopyButton({
                visibility: 'always',
                feedbackDuration: 3_000,
              }),
            ],
          })
        const contentOfHtml = (await processor.process(content)).toString()
        setHtmlContent(contentOfHtml)
      }
      processData()
    }
  }, [content,review])

  if (id) {
    return (
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

  function getFormattedDate() {
    const date = new Date();
    const options = { month: 'long', day: 'numeric', year: 'numeric' };
    const formattedDate = date.toLocaleDateString('en-US', options);
    
    const day = date.getDate();
    const suffix = (day % 10 === 1 && day !== 11) ? "st" :
                   (day % 10 === 2 && day !== 12) ? "nd" :
                   (day % 10 === 3 && day !== 13) ? "rd" : "th";

    return formattedDate.replace(/\d+/, `${day}${suffix}`);
}

  return (
    <div className="min-h-screen flex flex-col gap-5 mx-4 border-b relative">
      <h1 className='text-center text-2xl font-bold'>New Blog</h1>

      {review && htmlContent ? (
        <>
          <div className="min-h-screen flex justify-center border-t">
            <div className="md:w-[50%] min-h-screen flex flex-col gap-8 md:m-5 m-3">
              <div className="md:mx-3 flex flex-col gap-3 text-center">
                <h1 className="md:text-4xl text-2xl font-bold px-10">{title}</h1>
                <p className="font-semibold">{getFormattedDate()}</p>
              </div>
              <div className="line w-full border-b"></div>
              <div dangerouslySetInnerHTML={{ __html: htmlContent }} className="prose dark:prose-invert"></div>
            </div>
          </div>
        </>
      ) : (
        <>
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
        </>
      )}

      <Button className="absolute top-1 right-1" onClick={() => { setReview(!review) }}>{review ? <CircleX /> : <Play />}</Button>
    </div>
  );
}

export default AdminBlogsNew