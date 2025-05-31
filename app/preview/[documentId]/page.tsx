"use client"

import Cover from "@/components/shared/cover"
import Toolbar from "@/components/shared/toolbar"
import { Skeleton } from "@/components/ui/skeleton"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { useQuery } from "convex/react"
import dynamic from "next/dynamic"
import { use, useMemo } from "react"

interface DocumentIdPageProps {
  params: Promise<{
    documentId: Id<"documents">
  }>
}

const Page = ({ params }: DocumentIdPageProps) => {
    const { documentId } = use(params)
    const document = useQuery(api.document.getDocumentById, {id: documentId as Id<"documents">}) 

    const Editor = useMemo(() => dynamic(() => import("@/components/shared/editor"), { ssr: false }), [])

    if(document === undefined) return <div>
      <Cover.Skeleton />
      <div className="md:max-w-3xl lg:max-w-4xl mx-auto mt-10">
        <div className="space-y-4 pl-8 pt-4">
          <Skeleton className="h-14 w-[50%]" />
          <Skeleton className="h-14 w-[50%]" />
          <Skeleton className="h-14 w-[50%]" />
          <Skeleton className="h-14 w-[50%]" />
        </div>
      </div>
    </div>

    if(document === null) return null

    return (
      <div className="pb-40 mt-12">
        <Cover url={document.coverImage} preview/>

        <div className="md:max-w-3xl lg:max-w-4xl mx-auto">
            <Toolbar document={document} preview/>
            <Editor initialContent={document.content} editable={false} onChange={() => {}}/>
            </div>
        </div>
    )
}

export default Page