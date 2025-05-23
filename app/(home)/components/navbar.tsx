"use client"

import { ModeToggle } from "@/components/shared/mode-toggle"
import { Logo } from "./logo"
import { Button } from "@/components/ui/button"
import { UseScrolled } from "@/hooks/use-scrolled"
import { cn } from "@/lib/utils"
import { SignInButton, UserButton } from "@clerk/clerk-react"
import { useConvexAuth } from "convex/react"
import Link from "next/link"
import { Loader } from "@/components/ui/loader"

export const Navbar = () => {
  const scrolled = UseScrolled()
  const { isAuthenticated, isLoading } = useConvexAuth()
    
  return (
    <div className={cn("z-50 bg-background fixed top-0 flex items-center w-full md:px-6 px-2 py-3 justify-between", scrolled && "border-b shadow-md")}>
        <Logo />
        <div className="flex items-center gap-x-2 md:cursor-pointer">
			{isLoading && <Loader />}
          	{!isAuthenticated && !isLoading && (
				<>
					<SignInButton mode='modal'>
						<Button size={'sm'} variant={'ghost'}>
							Log In
						</Button>
					</SignInButton>
					<SignInButton mode='modal'>
						<Button size={'sm'}>Get Notion Free</Button>
					</SignInButton>
				</>
			)}
			
			{isAuthenticated && !isLoading && (
				<>
					<Button variant={'ghost'} size={'sm'} asChild>
						<Link href={'/documents'}>Enter Notion</Link>
					</Button>
					<UserButton afterSignOutUrl="/"/>
				</>
			)}  
          <ModeToggle />
        </div>
    </div>
  )
}