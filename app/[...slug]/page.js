"use client"
import dynamic from 'next/dynamic'
import React, { useEffect, useState, useMemo } from 'react'
import { useToast } from "@/hooks/use-toast"
import { notFound, usePathname, useRouter } from 'next/navigation'
import { Loader } from '@/components/Loader'
import { getStatusMessage } from '@/lib/statusMessage'
import { generateToken } from '@/lib/generateToken'

// Memoize(storing like) the component mapping so as to could retreive the component instead of recreating(if exist)
const componentCache = new Map()

const getDynamicComponent = (compName) => {
    if (!componentCache.has(compName)) {
        componentCache.set(
            compName,
            dynamic(() => import(`@/components/tabs/${compName}.js`), {
                ssr: false,
                loading: () => <Loader />
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
                const { token, id } = await generateToken()
                const req = await fetch("/api/checkSession", {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
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
                    setLogged(true)
                } else {
                    throw new Error("Something Went Wrong! You are logged out");
                }
            } catch (error) {
                toast({
                    title: `❌ ${error.message}`,
                    description: `Write your issue in footer!`,
                })
                router.push("/")
            }
        }
        checkSession()
    }, [router, toast])

    if (!logged) {
        return <Loader />
    }

    return <Component />
}

export default Page