import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { cn } from "@/lib/utils"
import { useUser } from "@clerk/clerk-react"
import { useMutation } from "convex/react"
import { ChevronDown, ChevronRight, LucideIcon, MoreHorizontal, Plus, Trash } from "lucide-react"
import { useRouter } from "next/navigation"
import React from "react"
import { toast } from "sonner"

interface ItemProps {
    id?: Id<"documents">
    label?: string
    level?: number
    isSearch?: boolean
    expended?: boolean
    active?: boolean
    icon?: LucideIcon
    documentIcon?: string
    onExpanded?: () => void
    onClick?: () => void
}

export const Item = ({ id, label, level, isSearch, onExpanded, icon: Icon, expended, onClick, active, documentIcon }: ItemProps) => {
    const { user } = useUser()
    const router = useRouter()
    const archive = useMutation(api.document.archive)
    const createDocument = useMutation(api.document.createDocument)

    const onCreateDocument = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        event.stopPropagation()

        if(!id){
            return
        }
        createDocument({ title: "Untitled", parentDocument: id }).then((document) => {
            if(!expended){
                onExpanded?.()
            }
        })
    }

    const handleExan = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        event.stopPropagation()
        onExpanded?.()
    }

    const onArchive = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        event.stopPropagation()
        if(!id) return

        const promise = archive({id}).then(res => router.push(`/documents`))
        toast.promise(promise, {
            loading: "Moving to trash...",
            success: "Note moved to trash!",
            error: "Failed to archive note!"
        })
    }

  return (
    <div onClick={onClick} style={{paddingLeft: level ? `${level * 12 + 12}px` : ""}} role="button" className={cn("group min-h-[27px] cursor-pointer text-sm p-1 pr-3 w-full hover:bg-primary/5 flex items-center text-muted-foreground font-medium", active && "bg-primary/5 text-primary")}>
        {!!id && (
            <div
                className="h-full rounded-sm cursor-pointer hover:bg-neutral-300 dark:hover:bg-neutral-600 mr-1"
                role="button"
                onClick={handleExan}
            >
                {expended ? (
                    <ChevronDown className="h-6 w-6 shrink-0 text-muted-foreground/50" />
                ) : (
                    <ChevronRight className="h-6 w-6 shrink-0 text-muted-foreground/50" />
                )}
            </div>
        )}

        {documentIcon ? (
            <div className="shrink-0 mr-2 text-[18px]">{documentIcon}</div>
        ) : Icon && (
            <Icon className="shrink-0 h-[18px] w-[18px] mr-2 text-muted-foreground" />
        )}

        <span className="truncate">{label}</span>

        
        {isSearch && (
            <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                <span className="text-xs">⌘</span>Q
            </kbd>
        )}

         {!!id && (
            <div className="ml-auto flex items-center gap-x-2">
            <DropdownMenu>
                <DropdownMenuTrigger onClick={(e) => e.stopPropagation()} asChild>
                <div
                    role="button"
                    className="opacity-0 group-hover:opacity-100 h-full ml-auto rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600"
                >
                    <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                    className="w-60"
                    align="start"
                    side="right"
                    forceMount
                >
                <DropdownMenuItem onClick={onArchive}>
                    <Trash className="h-6 w-6" />
                    Delete
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <div className="text-xs text-muted-foreground p-2">
                    Last edited by {user?.fullName}
                </div>
                {/* <p>50 776 07 66</p> */}
                </DropdownMenuContent>
            </DropdownMenu>

            <div
                className="opacity-0 group-hover:opacity-100 h-full ml-auto rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600"
                role="button"
                onClick={onCreateDocument}
            >
                <Plus className="h-4 w-4 text-muted-foreground" />
            </div>
        </div>
      )}
    </div>
  )
}

Item.Skeleton = function ItemSkeleton({ level }: { level?: number }){
    return (
        <div style={{paddingLeft: level ? `${level * 12 + 12}px` : ""}} className="flex gap-x-2 py-[3px]">
            <Skeleton className="h-4 w-4"/>
            <Skeleton className="h-4 w-[30%]"/>
        </div>
    )
}