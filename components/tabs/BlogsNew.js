import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import MDEditor from '@uiw/react-md-editor';
import { Play, Undo2 } from 'lucide-react';
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
import { Tooltip as ReactTooltip } from "react-tooltip";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { getStatusMessage } from '@/lib/statusMessage';
import { generateToken } from '@/lib/generateToken';


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

const AdminBlogsNew = () => {
  const { theme } = useTheme();
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("**Lets Begin!!!**");
  const [postId, setPostId] = useState(null)
  const [htmlContent, setHtmlContent] = useState("")
  const [review, setReview] = useState(false)
  const [category, setCategory] = useState("other")
  const [categories, setCategories] = useState([])
  const [otherCategoryValue, setOtherCategoryValue] = useState("")
  const [wait, setWait] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async () => {
    const timeout = setTimeout(() => controller.abort(), 120000); // 2-minute timeout
    try {
      setWait(true)
      const publishedTime = new Date().toISOString()
      const controller = new AbortController();
      const { token, id } = await generateToken()
      const req = await fetch(`/api/post`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title, content, publishedTime, categoryValue: category === "other" ? otherCategoryValue : category, id }),
        signal: controller.signal,
      })
      clearTimeout(timeout);
      if (!req.ok) {
        const statusText = await getStatusMessage(req.status)
        throw new Error(`Error ${req.status}: ${statusText}`);
      }
      const res = await req.json()
      setWait(false)
      if (res.success && res.id) {
        setPostId(res.id)
        toast({
          title: "✅ Successfully Posted!!",
          description: "You will get your id.",
        })
      } else {
        throw new Error("Error while creating new post!");
      }
    } catch (error) {
      clearTimeout(timeout);
      toast({
        title: `❌ ${error.message}`,
        description: `Write your issue in footer!`,
      })
      setWait(false);
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
  }, [content, review])


  useEffect(() => {
    (async () => {
      try {
        const { token, id } = await generateToken()
        const req = await fetch(`/api/fetchCategories`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ id })
        })
        if (!req.ok) {
          const statusText = await getStatusMessage(req.status)
          throw new Error(`Error ${req.status}: ${statusText}`);
        }
        const res = await req.json()
        if (res.success) {
          setCategories(res.data)
        } else {
          throw new Error("Unable to fetch categories!");
        }
      } catch (error) {
        toast({
          title: `❌ ${error.message}`,
          description: `Write your issue in footer!`,
        })
      }
    })()
  }, [])


  if (postId) {
    return (
      <div className='min-h-screen flex flex-col justify-center items-center'>
        <div className='flex flex-col justify-center items-center gap-5'>
          <h1 className='text-4xl'>✔️</h1>
          <h2>Your post has been posted successfully🥳.</h2>
          <div>
            <strong>ID:</strong>
            <span>&nbsp;{postId}</span>
          </div>
          <Link className='border p-2 rounded-3xl bg-purple-800 text-white' href={"/dashboard"}>Back to Dashboard</Link>
        </div>
      </div>
    )
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
            <Label htmlFor="category">Category</Label>
            <div className='flex gap-10'>
              <Select value={category} onValueChange={(e) => setCategory(e)} id="category">
                <SelectTrigger className="w-[280px]">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Choose One</SelectLabel>
                    {categories.map((category, index) => {
                      return <SelectItem key={index} value={category}>{category}</SelectItem>;
                    })}
                    <SelectItem value="other">Other</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              {category == "other" && <Input value={otherCategoryValue} onChange={(e) => setOtherCategoryValue(e.target.value)} type="other_value" id="other_value" placeholder="Other Value" />}
            </div>
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

          <Button disabled={wait} onClick={handleSubmit} className="mx-auto w-11/12">Post</Button>
        </>
      )}
      <Button
        data-tooltip-content={!review ? "See how it will look" : "Return to edit mode"}
        className="absolute top-1 right-1"
        onClick={() => setReview(!review)}
      >
        {review === false ? (
          <Play />
        ) : (
          <Undo2 />
        )
        }
      </Button >

      <ReactTooltip anchorSelect="[data-tooltip-content]" />

    </div >
  );
}

export default AdminBlogsNew