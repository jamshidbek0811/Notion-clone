"use client"

import { Button } from "@/components/ui/button"
import { Loader } from "@/components/ui/loader"
import { SignInButton } from "@clerk/clerk-react"
import { useConvexAuth } from "convex/react"
import { ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export const Heroes = () => {
      const { isAuthenticated, isLoading } = useConvexAuth()
  return (
    <>
        <div className="max-w-3xl space-y-4 max-md:px-2 min-h-[50vh] flex items-center justify-center flex-col">
            <h1 className="text-6xl font-semibold mb-12">Write, plan, share. With AI at your side.</h1>
            <h3 className='text-base sm:text-xl md:text-2xl font-medium'>
				Notion is the connected workspace where better, faster work happens.
			</h3>
            {isLoading && <div className="w-full flex items-center justify-center"><Loader size={"lg"}/></div>}
            
            {isAuthenticated && !isLoading && (
			    <Button>
			    	<Link href={'/documents'} className="flex items-center justify-center md:gap-1">
                        Enter Notion <ArrowRight className="h-4 w-4 ml-2"/>
                    </Link>
                </Button>
			)}  

            {!isAuthenticated && !isLoading && (
				<SignInButton mode='modal'>
					<Button>
						Get Notion free <ArrowRight className="h-4 w-4 ml-2"/>
					</Button>
				</SignInButton>
			)}
        </div>

        <div className="flex flex-col items-center justify-center max-w-5xl">
            <div className="flex items-center">
                <div className="relative h-[400px] w-[400px] hidden md:block">
                    <Image src={"/men.svg"} alt="Heroes" fill className="object-cover dark:hidden"/>
                    <Image src={"/men-dark.svg"} alt="Heroes" fill className="object-cover hidden dark:block"/>
                </div>
            </div>
        </div>
    </>
  )
}