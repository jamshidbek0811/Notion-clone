"use client"

import { Button } from "@/components/ui/button"
import { Loader } from "@/components/ui/loader"
import { api } from "@/convex/_generated/api"
import useSubscription from "@/hooks/use-subscription"
import { useUser } from "@clerk/clerk-react"
import { useMutation, useQuery } from "convex/react"
import { Plus } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

const Documents = () => {
  const { user } = useUser()
  const router = useRouter()
  const createDocument = useMutation(api.document.createDocument)
  const documents = useQuery(api.document.getAllDocuments)
  const { isLoading, data } = useSubscription(user?.emailAddresses[0].emailAddress!)
  
  
  const onCreateDocument = () => {
    if(documents?.length && documents.length >= 3 && data === "Free"){
        toast.error("You can already create 3 documents in the free plan! Please delete one documents this note!")
        return
    }
    const promise = createDocument({
      title: "Untitle"
    }).then(res => router.push(`/documents/${res}`))

    toast.promise(promise, {
      loading: "Creating a new blank..",
      success: "Created succes blank!",
      error: "Failed to create new blank!"
    })
  }
  return (
    <div className="h-screen w-full flex justify-center items-center space-y-4 flex-col">
      <Image src={"/note.svg"} alt="Logo" width={300} height={300} className="object-cover dark:hidden"/>
      <Image src={"/note-dark.svg"} alt="Logo" width={300} height={300} className="object-cover hidden dark:block"/>

      <h2 className="text-lg font-bold">
        Welcome to {user?.firstName}'s document page
      </h2>
      <Button onClick={onCreateDocument} disabled={isLoading}>
        {isLoading ? <><Loader/> <span>Loading...</span></> :(
          <>
            <Plus className="h-4 w-4"/>
            "Create a blank"
          </>
        )}
      </Button>
    </div>
  )
}

export default Documents