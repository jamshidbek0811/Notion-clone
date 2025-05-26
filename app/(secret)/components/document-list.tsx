"use client"

import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { useQuery } from "convex/react"
import { Item } from "./item"
import { useState } from "react"

interface DocumentListProps {
    parentDocumentId?: Id<"documents">
    level?: number
}

export const DocumentList = ({ parentDocumentId, level = 0 }: DocumentListProps) => {
    const [expended, setExpanded] = useState<Record<string, boolean>>({})
    const onExpand = (documentId: string) => {
        setExpanded(prev => ({
            ...prev, 
            [documentId]: !prev[documentId]
        }))
    }
    const documents = useQuery(api.document.getDocuments, {
        parentDocument: parentDocumentId
    })
  return (
    <>
        {documents?.map(document => (
            <div key={document._id}>
                <Item label={document.title} id={document._id} level={level} expended={expended[document._id]} onExpanded={() => onExpand(document._id)}/>
                {expended[document._id] && (
                    <DocumentList parentDocumentId={document._id} level={level + 1} />
                )}
            </div>
        ))}
    </>
  )
}