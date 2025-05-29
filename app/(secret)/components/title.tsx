import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel"
import { useMutation } from "convex/react";
import { ChangeEvent, KeyboardEvent, useRef, useState } from "react";

interface TitleProps {
    document: Doc<"documents">
}

export const Title = ({ document }: TitleProps) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const update = useMutation(api.document.UpdateField)
    const [title, setTitle] = useState(document.title || "Untitled")
    const [isEditting, setIsEditting] = useState(false)

    const enabledInput = () => {
        setTitle(document.title)
        setIsEditting(true)
        setTimeout(() => {
            inputRef.current?.focus()
            inputRef.current?.setSelectionRange(0, inputRef.current.value.length)
        }, 0)
    }

    const disabledInput = () => {
        setIsEditting(false)
    }

    const onChange = (event: ChangeEvent<HTMLInputElement>) => {
        setTitle(event.target.value)
        update({ id: document._id, title: event.target.value || "Untitled" })
    }

    const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        if(event.key === "Enter"){
            disabledInput()
        }
    }
    return (
      <div className="flex items-center justify-center gap-x-1">
        {!!document.icon && <p>{document.icon}</p>}
        {!!isEditting ? (
            <Input 
                ref={inputRef}
                onClick={enabledInput} 
                onBlur={disabledInput} 
                onChange={onChange} 
                onKeyDown={onKeyDown} 
                value={title} 
                className="h-7 px-2 focus-visible:ring-transparent" 
            />
        ) : (
            <Button
                className="font-normal h-auto p-1"
                variant={"ghost"}
                size={"sm"}
                onClick={enabledInput}
                >
                <span className="truncate">{document.title}</span>
            </Button>
        )}
      </div> 
    )
}

Title.Skeleton = function TitleSkeleton(){
    return <Skeleton className="h-9 w-20 rounded-md" />
}