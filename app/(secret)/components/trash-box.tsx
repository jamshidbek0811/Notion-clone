import ConfirmModal from "@/components/modals/confirm-modal"
import { Input } from "@/components/ui/input"
import { Loader } from "@/components/ui/loader"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import useSubscription from "@/hooks/use-subscription"
import { useUser } from "@clerk/clerk-react"
import { useMutation, useQuery } from "convex/react"
import { Search, Trash, Undo } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"

const TrashBox = () => {
  const router = useRouter()
  const params = useParams()
  const { user } = useUser()

  const restore = useMutation(api.document.restore)
  const remove = useMutation(api.document.remove)
  const alldocuments = useQuery(api.document.getAllDocuments)
  const { isLoading, data } = useSubscription(user?.emailAddresses[0].emailAddress!)
  const documents = useQuery(api.document.getTrashDocument)
  const [search, setSearch] = useState("")

  const filteredDocuments = documents?.filter(document => {
    return document.title.toLocaleLowerCase().includes(search.toLocaleLowerCase())
  })

  const onRemove = (documentId: Id<"documents">) => {
    const promise = remove({id: documentId})
    toast.promise(promise, {
      loading: "Removing document...",
      success: "Removed document!",
      error: "Failed to remove document!"
    })

    if(params.documentId === documentId){
      router.push(`/documents`)
    }
  }

  const onRestore = (documentId: Id<"documents">) => {
    if(alldocuments?.length && alldocuments.length >= 3 && data === "Free"){
        toast.error("You can already create 3 documents in the free plan")
        return
    }
    const promise = restore({ id: documentId })
    toast.promise(promise, {
        loading: "Restoring document...",
        success: "Restored document...",
        error: "Failed to restore document"
    })
  }

  if(documents === undefined){
    return (
      <div className="h-full flex items-center justify-center p-4">
        <Loader size={"lg"} />
      </div>
    )
  }

  return (
    <div className="text-sm">
        <div className="flex items-center gap-x-1 p-2">
            <Search className="w-4 h-4" />
            <Input value={search} onChange={(e) => setSearch(e.target.value)} className="h-7 px-2 focus-visible:ring-transparent bg-secondary" placeholder="Filter by page title..."/>
        </div>

        <div className="mt-2 px-1 pb-1">
            <p className="hidden last:block text-xs text-center text-muted-foreground pb-2">
                No Documents in trash
            </p>

            {filteredDocuments?.map(document => (
              <div key={document._id} onClick={() => router.push(`/documents/${document._id}`)} className="text-sm rounded-sm w-full hover:bg-primary/5 flex items-center cursor-pointer text-primary justify-between" role="button">
                <span className="truncate pl-2">{document.title}</span>
                <div className="flex items-center">
                  <div className="rounded-sm p-2 m-1 hover:bg-neutral-200 dark:bg-neutral-600" role="button" onClick={() => onRestore(document._id)}>
                    <Undo className="h-4 w-4 text-muted-foreground" />
                  </div>

                  <ConfirmModal onConfirm={() => onRemove(document._id)}>
                    <div className="rounded-sm p-2 m-1 hover:bg-neutral-200 dark:bg-neutral-600" role="button">
                      <Trash className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </ConfirmModal>
                </div>
              </div>
            ))}
        </div>
    </div>
  )
}

export default TrashBox