"use client"
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { RxHamburgerMenu } from "react-icons/rx";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { ModeToggle } from './ui/mode'
import { usePathname } from 'next/navigation';

const Navbar = () => {
  const [logged, setLogged] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const checkSession = async () => {
      const req = await fetch("/api/checkSession", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
      })
      const res = await req.json()
      if (!res.success) {
        setLogged(false)
      } else {
        setLogged(true)
      }
    }
    checkSession()
  }, [])

  if (!logged) {
    return (
      <nav className='flex mx-auto sticky top-0 p-2 md:p-2 justify-between items-center backdrop-blur border border-b-gray-400/50 z-50'>
        <div className='font-bold text-xl mx-2 md:mx-4'>
          <Link href={"/"}>SakshamWithWeb</Link>
        </div>
        <div className='flex'>
          <span className='hidden md:block'> <ModeToggle /></span>
          {/*For Smaller device*/}
          <div className='md:hidden mx-4'>
            <span className='mx-4'> <ModeToggle /></span>
            <Sheet>
              <SheetTrigger aria-label='hamburger'>
                <RxHamburgerMenu />
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>SakshamWithWeb</SheetTitle>
                  <SheetDescription>
                    <Link className='' href={`/#main`}>Home</Link>
                    <Link href={`/#about`}>About</Link>
                    <Link href={`/#knowledge`}>Knowledge</Link>
                    <Link className='' href={`/#projects`}>Projects</Link>
                  </SheetDescription>
                </SheetHeader>
              </SheetContent>
            </Sheet>
          </div>

          {/*For biger device*/}
          <ul className='md:flex md:mt-2 gap-3 mx-4 hidden'>
            <li><Link href={`/#main`}>Home</Link></li>
            <li><Link href={`/#about`}>About</Link></li>
            <li><Link href={`/#knowledge`}>Knowledge</Link></li>
            <li><Link href={`/#projects`}>Projects</Link></li>
          </ul>
        </div>
      </nav >
    )
  }

  return (
    <nav className='backdrop-blur z-50 sticky top-0 py-2 md:px-11 px-2 border-b flex items-center justify-between'>
      <Link className='font-bold text-xl' href={"/dashboard"}>SakshamWithWeb</Link>
      <div className='flex'>
        {/*For Smaller device*/}
        <div className='md:hidden mx-4'>
          <span className='mx-4'> <ModeToggle /></span>
          <Sheet>
            <SheetTrigger aria-label='hamburger'>
              <RxHamburgerMenu />
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>SakshamWithWeb</SheetTitle>
                <SheetDescription>
                  <Link className={`${pathname.includes("/dashboard") && "underline font-bold"}`} href={"/dashboard"}>Dashboard</Link>
                  <Link className={`${pathname.includes("/blogs") && "underline font-bold"}`} href={"/blogs"}>Blogs</Link>
                  <Link className={`${pathname.includes("/queries") && "underline font-bold"}`} href={"/queries"}>Queries</Link>
                </SheetDescription>
              </SheetHeader>
            </SheetContent>
          </Sheet>
        </div>

        {/*For biger device*/}
        <ul className='gap-3 md:flex hidden justify-center items-center'>
          <ModeToggle />
          <Link className={`${pathname.includes("/dashboard") && "underline font-bold"}`} href={"/dashboard"}>Dashboard</Link>
          <Link className={`${pathname.includes("/blogs") && "underline font-bold"}`} href={"/blogs"}>Blogs</Link>
          <Link className={`${pathname.includes("/queries") && "underline font-bold"}`} href={"/queries"}>Queries</Link>
        </ul>
      </div>
    </nav>
  )

}

export default Navbar
