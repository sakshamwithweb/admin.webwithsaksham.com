"use client"
import dynamic from 'next/dynamic'
import React, { useEffect, useState, useMemo } from 'react'
import { useToast } from "@/hooks/use-toast"
import { notFound, usePathname, useRouter } from 'next/navigation'

// Memoize(storing like) the component mapping so as to could retreive the component instead of recreating(if exist)
const componentCache = new Map()

const getDynamicComponent = (compName) => {
  if (!componentCache.has(compName)) {
    componentCache.set(
      compName,
      dynamic(() => import(`@/components/tabs/${compName}.js`), {
        ssr: false,
        loading: () => <div>Loading component...</div>
      })
    )
  }
  return componentCache.get(compName)
}

const Page = () => {
    const { toast } = useToast()
    const router = useRouter()
    const pathName = usePathname()
    const [logged, setLogged] = useState(false)
    const [validTabs] = useState(['/dashboard', '/blogs', '/queries', '/blogs/new'])

    if (!validTabs.includes(pathName)) {
        return notFound()
    }

    // Creating name and importing only when pathName is changed not on every render
    const Component = useMemo(() => {
        const compName = pathName.split("/")
            .slice(1)
            .map((url) => url.charAt(0).toUpperCase() + url.slice(1))
            .join('')
        return getDynamicComponent(compName)
    }, [pathName])

    useEffect(() => {
        const checkSession = async () => {
            try {
                const req = await fetch("/api/checkSession", {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({})
                })
                const res = await req.json()
                if (!res.success) {
                    toast({
                        title: "❌ Something Went Wrong",
                        description: "You are logged out",
                    })
                    router.push("/")
                } else {
                    setLogged(true)
                }
            } catch (error) {
                toast({
                    title: "❌ Error",
                    description: "Failed to check session",
                })
                router.push("/")
            }
        }
        checkSession()
    }, [router, toast])

    if (!logged) {
        return <div>Loading...</div>
    }

    return <Component />
}

export default Page