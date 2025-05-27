"use client"

import { Id } from "@/convex/_generated/dataModel"
import { use } from "react"

interface DocumentIdPageProps {
  params: Promise<{
    documentId: Id<"documents">
  }>
}

const DocumentIdPage = ({ params }: DocumentIdPageProps) => {
  const { documentId } = use(params)

  return (
    <div>{documentId}</div>
  )
}

export default DocumentIdPage