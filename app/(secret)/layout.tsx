"use client"

import { Loader } from "@/components/ui/loader"
import { ChildProps } from "@/types"
import { useConvexAuth } from "convex/react"
import { redirect } from "next/navigation"
import { Sidebar } from "./components"
import { SearchCommand } from "@/components/shared/search-command"

const SecretLayout = ({ children }: ChildProps) => {
  const { isLoading, isAuthenticated } = useConvexAuth()

  if(isLoading){
    return <div className="w-full h-screen flex items-center justify-center">
      <Loader size={"xl"}/>
    </div>
  }

  if(!isAuthenticated){
    return redirect("/")
  }

  return (
    <div className="w-full flex">
      <Sidebar />
      <main className="flex-1 h-full overflow-y-auto">
        <SearchCommand />
        {children}
      </main>
    </div>
  )
}

export default SecretLayout